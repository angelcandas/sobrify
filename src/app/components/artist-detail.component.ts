import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [UserService, ArtistService,AlbumService]
})

export class ArtistDetailComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public albums: Album[]
	public identity;
	public token;
	public alertMessage;
	public url: string;
	public is_edit;
	public artist_id;
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService,
	){
		this.titulo = 'Editar artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.is_edit = true;
		this.artist_id;
		this.confirmado=null;
	}
	ngOnInit(){
		console.log("artist-add esta cargado")
		// Llamar al metodo del api para sacar un artista en base a su id
		this.getArtist();
	}

		getAlbums(artist_id: string){
			this._albumService.getAlbums(this.token,artist_id).subscribe(
				res =>{
					console.log(res)
					if(!res.albums){
						console.log("no recibo albums")
						this._router.navigate(['/'])
					}else{
					this.albums = res.albums;
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
		this.confirmado = id;
	}
	onCancelAlbum(){
		this.confirmado = null;
	}
	onDeleteAlbum(id){
		this._albumService.deleteAlbum(this.token,id).subscribe(
				res =>{
					console.log(res)
					if(!res.albumRemoved){
						this.alertMessage="Album no eliminado correctamente"
					}else{
						this.getAlbums(this.artist_id);
					//this.maxPage= Math.ceil(res.totalItems/this.albums.length)
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


	getArtist(){
		this._route.params.forEach((params)=>{
			let id = params['id'];
			this._artistService.getArtist(this.token,id).subscribe(
				res =>{
					if(!res.artist){
						console.log("no recibo artista")
						this._router.navigate(['/'])
					}else{
					this.artist = res.artist;
					this.artist_id = res.artist._id
					this.getAlbums(this.artist_id)
					}
				},
				error=>{
					var errorMessage = <any>error;
			  		if (errorMessage != null) {
			  			var body = JSON.parse(error._body)
			  			this.alertMessage=body.message
			  			}
				})
		})
	}
}