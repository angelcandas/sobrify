import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { Artist } from '../models/artist';
@Component({
	selector: 'song',
	templateUrl: '../views/song-detail.html',
	providers: [UserService,SongService,AlbumService]
})

export class SongDetailComponent implements OnInit{
	public titulo: string;
	public album: Album;
	public artist: Artist;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public is_edit;
	public artist_id;
	public confirmado;
	public song_id;
	public song: Song;
	public temporal;
	public songDuration;
	public urlfile: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService,
		){
		this.titulo = 'Detalle de album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.is_edit = true;
		this.artist_id;
		this.song_id;
		this.confirmado=null;
		this.temporal;
		this.urlfile = GLOBAL.urlfile;
		this.album=new Album("","","","","");
		this.song=new Song("","","","","")
		this.artist=new Artist("","","")
		this.songDuration;
	}
	ngOnInit(){
		console.log("artist-add esta cargado")
		// Llamar al metodo del api para sacar un artista en base a su id
		this.getSong();
	}

	getSong(){
		console.log("Get Song")
		this._route.params.forEach(Params=>{
			let song_id = Params['song'];
			console.log(song_id)
			this._songService.getSong(this.token,song_id).subscribe(
				res=>{
					this.song=res.song;
					this.album= res.song.album;
					this.artist = res.song.album.artist;
					this.songDuration=Math.floor(+this.song.duration/60)+':'+(+this.song.duration%60);
				},
				err=>{
					console.log(err)
				})
		})
	}

}