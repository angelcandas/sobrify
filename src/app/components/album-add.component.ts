import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';


@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [UserService, ArtistService,AlbumService]
})

export class AlbumAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public album: Album;
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
	){
		this.titulo = 'Crear nuevo album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.urlfile = GLOBAL.urlfile;
		this.album = new Album("","","2017","","")
	}
	ngOnInit(){
		console.log("artist-add esta cargado")
	}
	onSubmit(){
		this._route.params.forEach((params: Params)=>{
				let artist_id = params['artist'];
				this.album.artist = artist_id;
			})
		this._albumService.addAlbum(this.token,this.album).subscribe(
			response=>{
					console.log(response)
					if(!response.albumStored){
						this.alertMessage='Error en el servicio'
					}else{
						this.album = response.albumStored;
						this.alertMessage=this.album.title+' se ha añadido correctamente';
						
						this._router.navigate(['/album-edit',response.albumStored._id])
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