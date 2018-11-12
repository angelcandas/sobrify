import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { SongService} from'../services/song.service';

@Component({
	selector: 'album',
	templateUrl: '../views/album-detail.html',
	providers: [UserService,AlbumService,SongService]
})

export class AlbumDetailComponent implements OnInit{
	public titulo: string;
	public album: Album;
	public songs: Song[];
	public identity;
	public token;
	public album_id;
	public alertMessage;
	public url: string;
	public urlfile: string;

	public is_edit;
	public artist_id;
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService,
	){this.urlfile = GLOBAL.urlfile;
		this.titulo = 'Detalle de album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.is_edit = true;
		this.artist_id;
		this.album_id;
		this.confirmado=null;
		this.album=new Album("asd","ads","asd","as","asda")
	}
	ngOnInit(){
		console.log("artist-add esta cargado")
		// Llamar al metodo del api para sacar un artista en base a su id
		this.getAlbum();
	}

		getSongs(artist_id: string){
			this._songService.getSongs(this.token,artist_id).subscribe(
				res =>{
					console.log(res)
					if(!res.song){
						console.log("no recibo canciones")
						this._router.navigate(['/'])
					}else{
					this.songs = res.song;
					console.log(this.songs)
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
	onDeleteConfirm(id){
		this.confirmado=id;
	}
	onCancelSong(){
		this.confirmado=null;
	}
	onDeleteSong(id){
		this._songService.deleteSong(this.token,id).subscribe(
				res =>{
					console.log(res)
					if(!res.songRemoved){
						this.alertMessage="Error al eliminar el album";
					}
					this.getSongs(this.album_id);
				},
				error=>{
					var errorMessage = <any>error;
			  		if (errorMessage != null) {
			  			var body = JSON.parse(error._body)
			  			this.alertMessage=body.message
			  			}
				})
	}
	getDuration(duration){
		return(Math.floor(+duration/60)+':'+(+duration%60))
	}
	getAlbum(){
		this._route.params.forEach(Params=>{
			let album_id = Params['album']
			this.album_id=album_id;
			this._albumService.getAlbum(this.token,album_id).subscribe(
				res=>{
					this.album=res.album;
					this.artist_id=res.album.artist._id;
					this.getSongs(album_id);
				},
				err=>{
					
				})
		})
	}

	startPlayer(song){
		let song_player = JSON.stringify(song);
		var ppbut=document.getElementById("ppbut")
		let file_path = this.urlfile+song.file;
		let image_path = this.urlfile+song.album.image;
		console.log(document.getElementById('mp3-source').getAttribute('src'))

		localStorage.setItem('sound_song',song_player);
		localStorage.setItem('sound_path',file_path);
		localStorage.setItem('sound_image',image_path);
		document.getElementById('mp3-source').setAttribute("src",file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();
		document.getElementById("play-song-title").innerHTML=song.name;
		document.getElementById("play-song-artist").innerHTML=song.album.artist.name;
		document.getElementById("play-image-album").setAttribute('src',image_path);
		ppbut.setAttribute('class',"fas fa-pause")
	}
}