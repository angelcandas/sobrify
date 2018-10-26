import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';


@Component({
	selector: 'artist-list',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public urlfile: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		){
		this.titulo = 'Crear nuevo artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist("","","")
		this.urlfile = GLOBAL.urlfile;
	}
	ngOnInit(){
		console.log("artist-add esta cargado")
	}
	onSubmit(){
		this._artistService.addArtist(this.token,this.artist).subscribe(
			response=>{
				console.log(response)
				if(!response.artistStored){
					this.alertMessage='Error en el servicio'
				}else{
					this.artist = response.artistStored;
					this.alertMessage=this.artist.name+' se ha añadido correctamente';
					this._router.navigate(['/editar-artista',response.artistStored._id])
				}
			},
			error=>{
				var errorMessage = <any>error;
				if (errorMessage != null) {
					var body = JSON.parse(error._body)
					this.alertMessage=body.message
				}
			})
		console.log(this.artist)
	}
}