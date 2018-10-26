import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song} from '../models/song';


@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [UserService, ArtistService,AlbumService,SongService]
})

export class SongAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public song: Song;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public urlfile: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService,
		){
		this.titulo = 'Añadir nueva cancion';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.urlfile = GLOBAL.urlfile;
		this.album = new Album("","","","","");
		this.song = new Song("","","","","")
	}
	ngOnInit(){
		console.log("song-add esta cargado")
		this.getAlbum()
	}
	getAlbum(){
		this._route.params.forEach(params=>{
			let album_id=params['album']
			this._albumService.getAlbum(this.token,album_id).subscribe(
				res=>{
					if(!res.album){
						console.log(res)
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
			let album_id = params['album'];
			this.song.album = album_id;
		})
		this._songService.addSong(this.token,this.song).subscribe(
			response=>{
				console.log(response)
				if(!response.song){
					this.alertMessage='Error en el servicio'
				}else{
					this.album = response.song;
					this.alertMessage=this.album.title+' se ha añadido correctamente';
					
					this._router.navigate(['/song-edit',response.song._id])
				}
			},
			error=>{
				var errorMessage = <any>error;
				if (errorMessage != null) {
					var body = JSON.parse(error._body)
					this.alertMessage=body.message
				}
			})
		console.log(this.album)
	}
}