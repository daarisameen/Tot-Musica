import os
import secrets
from functools import wraps
from flask import request, jsonify, make_response
from application import app
from flask_restful import Api, Resource, reqparse, marshal_with, fields, marshal
from application.models import *
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_login import current_user
from mutagen.mp3 import MP3
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_current_user, verify_jwt_in_request


def get_audio_duration(file_path):
    try: 
       
        audio = MP3(file_path)
        duration_in_seconds = audio.info.length
        minutes, seconds = divmod(duration_in_seconds, 60)
        duration = f"{int(minutes):02}:{int(seconds):02}"
        return duration
    except:
        return None 


api = Api()
api.prefix = '/api'    

from application import jwt

#----------------------------------------- Output Fields ---------------------------------------------------

user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'username': fields.String,
    'password_hash': fields.String,
    'is_creator': fields.Boolean,
    'is_flagged': fields.Boolean,
    'fs_uniquifier': fields.String,
    'active': fields.Boolean
}

song_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'filename': fields.String,
    'duration': fields.String,
    'lyrics': fields.String,   
    'album_id': fields.Integer,
    'artist_id': fields.Integer,
    'creator_id': fields.Integer,
    'timestamp': fields.DateTime(dt_format='rfc822'),
    'is_flagged': fields.Boolean

}

artist_fields = {
    'id': fields.Integer,
    'name': fields.String
}
playlist_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'songs': fields.List(fields.Nested({
        'id': fields.Integer,
        'title': fields.String,
    }))
}

album_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String,
    'artist': fields.Nested(artist_fields),
    'songs': fields.List(fields.Nested(song_fields)),
}

# =======================================================================

def auth_role(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            roles = role if isinstance(role, list) else [role]
            print(current_user)
            for r in roles:
                print(current_user.roles)
                print(current_user.has_role(r), r)
            if all(not current_user.has_role(r) for r in roles):
                return make_response({"message": f"Missing any of roles {','.join(roles)}"}, 403)
            return fn(*args, **kwargs)
        return decorator
    return wrapper

    
#======================================= Registration and Login =========================================

register_parser = reqparse.RequestParser()
register_parser.add_argument('name', type=str, required=True, help='Please provide a value')
register_parser.add_argument('email', type=str, required=True, help='Please provide a value')
register_parser.add_argument('username', type=str, required=True, help='Please provide a value')
register_parser.add_argument('password', type=str, required=True, help='Please provide a value')
register_parser.add_argument('confirm_password', type=str, required=True, help='Please provide a value')


class UserRegistration(Resource):
    def post(self):
        args = register_parser.parse_args()

        if args['password'] != args['confirm_password']:
            return {'message': 'Password and Confirm Password do not match.'}
        
        existing_user = User.query.filter_by(username=args['username']).first()

        if existing_user:
            return {'message': 'User already exists.'}, 404
        else:
            user_role = Role.query.filter_by(name='user').first()
            if not user_role:
                # Create the role if it doesn't exist
                user_role = Role(name='user')
                db.session.add(user_role)
                db.session.commit()

            if args['username'] == 'admin' and args['password'] == 'admin':
                user_role = Role.query.filter_by(name='admin').first()
                if not user_role:
                    user_role = Role(name='admin')
                    db.session.add(user_role)
                    db.session.commit()


            hashed_password = generate_password_hash(args['password'])
            user = User(name=args['name'], username=args['username'], password_hash=hashed_password, email=args['email'])
            user.fs_uniquifier = secrets.token_hex(16)
            user.roles.append(user_role)  # Assign the role to the user

            db.session.add(user)
            db.session.commit()
            return {'message': 'Successfully registered'}, 201
        

api.add_resource(UserRegistration, '/register')


login_parser = reqparse.RequestParser()
login_parser.add_argument('username', type=str, required=True, help='Please provide a value')
login_parser.add_argument('password', type=str, required=True, help='Please provide a value')


class UserLogin(Resource):
    def post(self):
        args = login_parser.parse_args()
        username = args['username']
        password =args['password']

        user = User.query.filter_by(username=username).first()

        if user:
            if user.is_flagged:
                return {'message': 'You are not allowed to use this platform'}, 404
            else:
                
                if check_password_hash(user.password_hash, password):
                    access_token = create_access_token(identity=user.id)
                    print(user.roles)
                    return jsonify({'status': 'success','message': 'Successfully logged in.', 'access_token': access_token, "username": username})
                else:
                    return {'message': 'Incorrect username or password.'}, 404
        else:
            return {'message': 'Incorrect username or password.'}, 404   
       

api.add_resource(UserLogin, '/signin')


# class UserLogout(Resource):
#     def post(self):
#         # current_user = get_jwt_identity() 
#         return jsonify({'status': 'success', 'message': 'Successfully logged out user'})

# api.add_resource(UserLogout, '/signout')


#============================================== USER =====================================================

profile_parser = reqparse.RequestParser()
profile_parser.add_argument('name', type=str)
profile_parser.add_argument('username', type=str)
profile_parser.add_argument('current_password')
profile_parser.add_argument('new_password')

class UpdateProfile(Resource):
    @marshal_with(user_fields)
    def put(self, user_id):
        args = profile_parser.parse_args()
        user = User.query.get(user_id)
        if user:
            if check_password_hash(user.password_hash, args['current_password']):
                user.name = args['name']
                user.username = args['username']
                hashed_password = generate_password_hash(args['new_password'])
                user.password_hash = hashed_password
                db.session.commit()
                return user, 201
            else:
                return {'message': 'Incorrect current password.'}, 404
        else:
            return {'message': 'User not found.'}, 404
        

api.add_resource(UpdateProfile, '/update_profile/<int:user_id>')

class UserRoleResource(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user_id = get_jwt_identity()

            user = User.query.get(current_user_id)

            if user:
                # Get the roles associated with the user
                roles = [role.name for role in user.roles]
                return {'roles': roles}, 200
            else:
                return {'message': 'User not found'}, 404

        except Exception as e:
            return {'message': str(e)}, 500

# Add the API resource to your Flask app
        
api.add_resource(UserRoleResource, '/user_role')


#============================================= CREATOR =========================================================

creator_register_parser = reqparse.RequestParser()
creator_register_parser.add_argument('response', type=bool, default=False)

class CreatorRegistration(Resource):
    @jwt_required()
    def put(self):
        args = creator_register_parser.parse_args()
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user and not user.is_creator:
            if args['response']:
                user_role = Role.query.filter_by(name='creator').first()
                if not user_role:
                    user_role = Role(name='creator')
                    db.session.add(user_role)
                    db.session.commit()

                user.roles.append(user_role)
                user.is_creator = True
                db.session.commit()
                return {'message': 'Account upgraded to creator.'}, 201
            else:
                return {'message': 'User account.'}, 201
        else:
            return {'message': 'NOTHING'}, 404    



api.add_resource(CreatorRegistration, '/register_creator')

class CreatorResource(Resource):
    def get(self):
        creators = User.query.filter_by(is_creator=True).all()
        return marshal(creators, user_fields), 201

api.add_resource(CreatorResource, '/all_creators')


class CreatorStatistics(Resource):
    @jwt_required()
    def get(post):
        current_user_id = get_jwt_identity()
        albums = Album.query.filter_by(creator_id=current_user_id).order_by(Album.timestamp.desc()).all()
        n_songs = Song.query.filter(Song.creator_id==current_user_id).count()
        n_albums = Album.query.filter(Album.creator_id==current_user_id).count()
        avg_rating = (
        db.session.query(func.avg(Interactions.rating))
        .join(Song)
        .filter(Song.creator_id == current_user_id)
        .scalar()
        )
        if avg_rating:
            avg_rating = round(avg_rating, 1)
        else:
            avg_rating=0  

        stats = {'song_count': n_songs, 'album_count': n_albums, 'average_rating': avg_rating}

        return stats, 200    
    
api.add_resource(CreatorStatistics, '/creator_statistics')    
# ========================================== ADMIN ====================================================

# class AdminLogin(Resource):
#     def post(self):
#         args = login_parser.parse_args()
#         if args['username']=='admin' and  args['password']=='admin':
#             return {'message': 'You are now logged in as admin.'}, 201
#         else:
#             return {'message': 'Incorrect username or password.'}, 404
        
# api.add_resource(AdminLogin, '/admin_login')      


class AdminStatistics(Resource):
    def get(self):
        songs = Song.query.all()
        creators = User.query.filter_by(is_creator=True).all()

        n_users = User.query.filter(User.is_creator==False).count()
        n_creators = User.query.filter(User.is_creator==True).count()
        n_songs = Song.query.count()
        n_albums = Album.query.count()
        n_artists = Artist.query.count()
        avg_rating = db.session.query(func.avg(Interactions.rating)).scalar()
        avg_rating = round(avg_rating, 1)

        stats = {'user_count': n_users, 'creator_count': n_creators, 'song_count': n_songs,
                 'album_count': n_albums, 'artist_count': n_artists, 'average_rating': avg_rating}
        
        return stats, 200

api.add_resource(AdminStatistics, '/admin_statistics')


class AdminSongs(Resource):
    def get(self):
            songs = Song.query.order_by(Song.timestamp.desc()).all()
            songs_list = []
            for song in songs:
                artist = Artist.query.get(song.artist_id)
                song_data = {"id": song.id, "title": song.title, "filename": song.filename, "duration": song.duration,"lyrics": song.lyrics, "artist": artist.name, "album_id": song.album_id, "artist_id": song.artist_id, "creator_id": song.creator_id, "is_flagged": song.is_flagged}
                songs_list.append(song_data)
            return {'songs': songs_list}, 201

api.add_resource(AdminSongs, '/admin_songs')    


flag_parser = reqparse.RequestParser()
flag_parser.add_argument('response', type=bool, default=False)

class FlagSong(Resource):
    def put(self, song_id):
        args = flag_parser.parse_args()
        song = Song.query.get(song_id)
        if song:
            song.is_flagged = args['response']
            db.session.commit()
            return {'song': marshal(song, song_fields)}, 200
        else:
            return {'message': 'song not found.'}    
        

api.add_resource(FlagSong, '/flag_song/<int:song_id>')


class FlagCreator(Resource):
    def put(self, user_id):
        args = flag_parser.parse_args()
        creator = User.query.get(user_id)
        if creator:
            creator.is_flagged = args['response']
            db.session.commit()
            return {'user': marshal(creator, user_fields)}, 200
        else:
            return {'message': 'user not found.'}    
        
        

api.add_resource(FlagCreator, '/flag_creator/<int:user_id>')


# ================================================= SONGS ==============================================
   
class SongListResource(Resource):
    def get(self):
        songs = Song.query.filter_by(is_flagged=False).order_by(Song.timestamp.desc()).all()
        songs_list = []
        for song in songs:
            artist = Artist.query.get(song.artist_id)
            song_data = {"id": song.id, "title": song.title, "filename": song.filename, "duration": song.duration,"lyrics": song.lyrics, "artist": artist.name, "album_id": song.album_id, "artist_id": song.artist_id, "creator_id": song.creator_id, "is_flagged": song.is_flagged}
            songs_list.append(song_data)
        return {'songs': songs_list}, 201    
    

    @marshal_with(song_fields)
    @jwt_required()
    def post(self):
        title = request.form.get("title")
        lyrics = request.form.get("lyrics")
        a = request.form.get("artist")

        #Search for artist. If not found in db, create one.
        artist = Artist.query.filter_by(name=a).first()
        if not artist:
            artist = Artist(name=a)
            db.session.add(artist)
            db.session.commit()

        song = Song(title=title, lyrics=lyrics, artist_id=artist.id)
       
        if 'file' not in request.files:
            return {'message': 'No file part'}, 400

        file = request.files['file']
        if file.filename == '':
            return {'message': 'No selected file'}, 400
        
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        song.filename = filename
        duration = get_audio_duration(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        song.duration = duration
        song.creator_id = get_jwt_identity()
        db.session.add(song)
        db.session.commit()
        return song, 201

    
api.add_resource(SongListResource, '/songs')    


song_parser = reqparse.RequestParser()
song_parser.add_argument('title', type=str)
song_parser.add_argument('artist', type=str)
song_parser.add_argument('lyrics', type=str)


class SongResource(Resource):
    def get(self, song_id):
        song = Song.query.get(song_id)
        if song:
            artist = Artist.query.get(song.artist_id)
            song_data = {"id": song.id, "title": song.title, "filename": song.filename, "duration": song.duration,"lyrics": song.lyrics, "artist": artist.name, "album_id": song.album_id, "artist_id": song.artist_id, "creator_id": song.creator_id, "is_flagged": song.is_flagged}
            return song_data, 201
        else:
            return {'message': 'Song not found'}, 404 
        

    def put(self, song_id):
        args = song_parser.parse_args()
        song = Song.query.get(song_id)
        song.title = args['title']
        song.lyrics = args['lyrics']

        artist = Artist.query.filter_by(name=args['artist']).first()
        if not artist:
            artist = Artist(name=args['artist'])
            db.session.add(artist)
            db.session.commit()

        song.artist_id = artist.id
        db.session.commit()
        return {'song': marshal(song, song_fields)}, 200
    

    def delete(self, song_id):
        song = Song.query.get(song_id)
        if song:
            db.session.delete(song)
            db.session.commit()
            return {'message': 'Song deleted successfully'}, 200
        else:
            return {'message': 'Song not found'}, 404


    
api.add_resource(SongResource, '/song/<int:song_id>')


filter_parser = reqparse.RequestParser()
filter_parser.add_argument('filter_type', type=str, choices=('title', 'artist', 'rating') ,required=True, help='Please provide a value')
filter_parser.add_argument('filter_value', type=str, required=True, help='Please provide a value')

class FilteredSongs(Resource):
    def get(self):
        query = Song.query.filter_by(is_flagged=False).order_by(Song.timestamp.desc())
        filter_type = request.args.get('filter_type')
        filter_value = request.args.get('filter_value')
        # print("Filter Type:", filter_type, flush=True)
        # print("Filter Value:", filter_value, flush=True)

        if filter_type:
            if not filter_value:
                return {'message': 'Please specify a value to search'}, 404
            elif filter_value:
                    if filter_type == 'artist':
                        query = query.join(Artist).filter(Artist.name.ilike(f"%{filter_value}%"))
                    elif filter_type == 'title':
                        query = query.filter(Song.title.ilike(f"%{filter_value}%"))
                    elif filter_type == 'rating':
                        try:
                            rating = float(filter_value)
                            query = query.join(Interactions).group_by(Song.id).having(db.func.avg(Interactions.rating) == rating)
                        except ValueError:
                            return {'message': 'Invalid rating value.'}, 404
                           
        filtered_songs = query.all()
        songs_list = []
        for song in filtered_songs:
            artist = Artist.query.get(song.artist_id)
            song_data = {"id": song.id, "title": song.title, "filename": song.filename, "duration": song.duration,"lyrics": song.lyrics, "artist": artist.name, "album_id": song.album_id, "artist_id": song.artist_id, "creator_id": song.creator_id, "is_flagged": song.is_flagged}
            songs_list.append(song_data)

        return {'songs': songs_list}, 201    

api.add_resource(FilteredSongs, '/songs/filter')


like_parser = reqparse.RequestParser()
like_parser.add_argument('like', type=bool, default=False)

class LikeSongResource(Resource):
    @jwt_required()
    def post(self, song_id):
        args = like_parser.parse_args()
        song = Song.query.get(song_id)
        current_user_id = get_jwt_identity()
        print(current_user_id)
        like = args['like']
        existing_interaction = Interactions.query.filter_by(user_id=current_user_id, song_id=song.id).first()
        if existing_interaction:
            existing_interaction.liked = args['like']
        else:
            new_interaction = Interactions(user_id=current_user_id, song_id=song.id, liked=like)
            db.session.add(new_interaction)

        db.session.commit()
        return {'song': marshal(song, song_fields)}, 200

api.add_resource(LikeSongResource, '/like/<int:song_id>')


rating_parser = reqparse.RequestParser()
rating_parser.add_argument('rating', type=float, choices=[1, 2, 3, 4, 5], default=0)

class RateSongResource(Resource):
    @jwt_required()
    def post(self, song_id):
        args = rating_parser.parse_args()
        song = Song.query.get(song_id)
        current_user_id = get_jwt_identity()
        rating = args['rating']
        existing_interaction = Interactions.query.filter_by(user_id=current_user_id, song_id=song.id).first()
        if existing_interaction:
            existing_interaction.rating = rating
        else:
            new_interaction = Interactions(user_id=current_user_id, song_id=song.id, rating=rating)
            db.session.add(new_interaction)

        db.session.commit()
        return {'song': marshal(song, song_fields)}, 200

api.add_resource(RateSongResource, '/rate/<int:song_id>')


# =============================================== PLAYLISTS =================================================

playlist_parser = reqparse.RequestParser()
playlist_parser.add_argument('name', type=str, required=True, help='Please provide a value')
playlist_parser.add_argument('songs', type=int, action='append', required=True, help='Please provide a value')

class PlaylistListResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        playlists = Playlist.query.filter_by(user_id=current_user_id).order_by(Playlist.timestamp.desc()).all()
        playlists_list = []
        for playlist in playlists:
            playlist_data = {'id': playlist.id, 'name': playlist.name}
            playlists_list.append(playlist_data)

        return {'playlists': playlists_list}, 201    
    
    
    @marshal_with(playlist_fields)
    @jwt_required()
    def post(self):
        data = request.get_json()
        playlist_name = data.get('name')
        song_ids = data.get('songs', [])
        current_user_id = get_jwt_identity()

        #Create new playlist
        new_playlist = Playlist(name=playlist_name, user_id=current_user_id)
        db.session.add(new_playlist)
        db.session.commit()

        # Add songs to the playlist
        songs = Song.query.filter(Song.id.in_(song_ids)).all()
        new_playlist.songs.extend(songs)
        db.session.commit()

        return new_playlist, 201

api.add_resource(PlaylistListResource, '/playlists')




class PlaylistResource(Resource):
    @jwt_required()
    def get(self, playlist_id):
        playlist = Playlist.query.get(playlist_id)
        if playlist:
            return marshal(playlist, playlist_fields), 200
        else:
            return {'message': 'Playlist not found.'}, 404
        
    @marshal_with(playlist_fields)
    @jwt_required()
    def put(self, playlist_id):
        data = request.get_json()
        playlist_name = data.get('name')
        song_ids = data.get('songs', [])
        current_user_id = get_jwt_identity()


        playlist = Playlist.query.filter_by(id=playlist_id, user_id=current_user_id).first()

        if not playlist:
            return {'error': 'Playlist not found or you do not have permission to update it'}, 404

        # Update playlist information
        if playlist_name:
            playlist.name = playlist_name


        # Update songs in the playlist
        if playlist and song_ids:
            playlist.songs = []  # Clear existing 
            songs = Song.query.filter(Song.id.in_(song_ids)).all()
            playlist.songs.extend(songs)
   
        playlist = Playlist.query.filter_by(id=playlist_id, user_id=current_user_id).first()
        db.session.commit()

        return playlist, 200    


    def delete(self, playlist_id):
        playlist = Playlist.query.get_or_404(playlist_id)
        if playlist:
            db.session.delete(playlist)
            db.session.commit()
            return {'message': 'Playlist deleted successfully'}, 201
        else:
            return {'message': 'Playlist not found'}, 404  


api.add_resource(PlaylistResource, '/playlist/<int:playlist_id>')


#============================================= ALBUMS =====================================================

album_parser = reqparse.RequestParser()
album_parser.add_argument('name', type=str, required=True, help='Please provide a value')
album_parser.add_argument('genre', type=str, choices=('Pop', 'Metal', 'Classical', 'Other'), default='Other')
album_parser.add_argument('artist', type=str, required=True, help='Please provide a value')
album_parser.add_argument('songs', type=int, action='append', required=True, help='Please provide a value')

class AlbumListResource(Resource):
    def get(self):
        albums = Album.query.order_by(Album.timestamp.desc()).all()
        albums_list = []
        for album in albums:
            artist = Artist.query.get(album.artist_id)
            album_data = {'id': album.id, 'name': album.name, 'genre': album.genre, 'artist': artist.name}
            albums_list.append(album_data)

        return {'albums': albums_list}, 201   

    @jwt_required()
    @marshal_with(album_fields)
    def post(self):
        current_user_id = get_jwt_identity()
        args = album_parser.parse_args()

        artist_name = args['artist']
        artist = Artist.query.filter_by(name=artist_name).first()
        if not artist:
            artist = Artist(name=artist_name)
            db.session.add(artist)
            db.session.commit()

        album = Album(
            name=args['name'],
            genre=args['genre'],
            artist_id=artist.id,
            creator_id=current_user_id
        )

        db.session.add(album)
        db.session.commit()
        album_id = album.id
        print('album id', album_id)


        song_ids = args['songs']
        print("song ids", song_ids)
        songs = Song.query.filter(Song.id.in_(song_ids)).all()
        print(songs)
        album.songs.extend(songs)

        db.session.commit()

        return album, 201 
       
        

api.add_resource(AlbumListResource, '/albums')    



class AlbumResource(Resource):
    @marshal_with(album_fields)
    def get(self, album_id):
        album = Album.query.get(album_id)
        if album:
            artist = Artist.query.get(album.artist_id)
            return {'id': album.id, 'name': album.name, 'genre': album.genre, 'artist': artist, 'songs': album.songs}
        else:
            return {'message': 'Album not found.'}, 404
        

    @marshal_with(album_fields)
    def put(self, album_id):
        album = Album.query.get(album_id)
        if not album:
            return {'message': 'Album not found.'}, 404

        args = album_parser.parse_args()

        if args['name']:
            album.name = args['name']
        if args['genre']:
            album.genre = args['genre']
        if args['artist']:
            artist_name = args['artist']
            artist = Artist.query.filter_by(name=artist_name).first()
            if not artist:
                artist = Artist(name=artist_name)
                db.session.add(artist)
                db.session.commit()
            album.artist_id = artist.id
        if args['songs']:
            song_ids = args['songs']
            songs = Song.query.filter(Song.id.in_(song_ids)).all()
            album.songs = songs

        db.session.commit()

        return album, 200
    

    def delete(self, album_id):
        album = Album.query.get(album_id)
        if album:
            db.session.delete(album)
            db.session.commit()
            return {'message': 'Album deleted successfully'}, 201
        else:
            return {'message': 'Album not found'}, 404
        

api.add_resource(AlbumResource, '/album/<int:album_id>')