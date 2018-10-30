import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song} from '../models/song';


@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.html',
	providers: [UserService, ArtistService,AlbumService,SongService,UploadService]
})

export class SongEditComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public song: Song;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public is_edit;
	public song_id;
	public urlfile: string;
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService,
		private _uploadService: UploadService,
	){
		this.titulo = 'Editar cancion';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
this.urlfile = GLOBAL.urlfile;
		this.album = new Album("","","","","");
		this.song = new Song("","","","","")
		this.is_edit = true;
		this.song_id;
	}
	ngOnInit(){
		console.log("song-add esta cargado")
		this.getSong()
	}
	getSong(){
		this._route.params.forEach(params=>{
			let song_id = params['song'];
			this._songService.getSong(this.token,song_id).subscribe(
				res=>{
					if(!res.song){
						console.log(res)
					}else{
						//console.log(res)
						this.song=res.song;
						this.album=res.song.album;
						//console.log(this.song.album['artist']._id);
						//console.log(this.album);
					}
				}
				,err=>{


				}
				)
		})
	}


	getAlbum(){
		this._route.params.forEach(params=>{
			let album_id=params['album']
			this._albumService.getAlbum(this.token,album_id).subscribe(
				res=>{
					if(!res.album){
						//console.log(res)
					}
					else{
						this.album=res.album;
					}
				},
				err=>{

				})
		});
	}	

	onSubmit(){
		this._route.params.forEach((params: Params)=>{
				this.song_id = params['song'];
			})
		this._songService.editSong(this.token,this.song_id,this.song).subscribe(
			response=>{
					//console.log(response)
					if(!response.song){
						this.alertMessage='Error en el servicio'
					}else{
						this.song = response.song;
						this.alertMessage=this.song.name+' se ha actualizado correctamente';
								if(!this.filesToUpload){
									this._router.navigate(['/album',this.album['_id']])
								}else{
								this._uploadService.makeFileRequest(this.url+'upload-song/'+this.song_id,[],this.filesToUpload,this.token,'file')
								.then(
									(result)=>{
										console.log(result)
										this._router.navigate(['/album',this.album['_id']])
									},
									(error)=>{
									    console.log(error);
								})
			}
					}
			},
				error=>{
			var errorMessage = <any>error;
	  		if (errorMessage != null) {
	  			var body = JSON.parse(error._body)
	  			this.alertMessage=body.message
	  			}
			})

		}

		public filesToUpload: Array<File>;
		fileChangeEvent(fileInput: any){
			this.filesToUpload = <Array<File>>fileInput.target.files;
		}
}