import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';


@Component({
	selector: 'artist-lista',
	templateUrl: '../views/artist-list.html',
	providers: [UserService,ArtistService]
})

export class ArtistListComponent implements OnInit{
	public titulo: string;
	public artists: Artist[];
	public identity;
	public token;
	public url: string;
	public next_page;
	public prev_page;
	public alertMessage;
	public maxPage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
	){
		this.titulo = 'Artistas';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.next_page =1;
		this.prev_page =1;
		this.maxPage=10;
	}
	ngOnInit(){
		this.getArtists();
	}
	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}
	onCancelArtist(){
		this.confirmado=null;
	}
	onDeleteArtist(id){
		this._artistService.deleteArtist(this.token,id).subscribe(
				res =>{
					console.log(res)
					if(!res.artist){
						alert("Error en el servidor");
					}
					this.getArtists();
				},
				error=>{
					var errorMessage = <any>error;
			  		if (errorMessage != null) {
			  			var body = JSON.parse(error._body)
			  			this.alertMessage=body.message
			  			}
				})
	}


	getArtists(){
		this._route.params.forEach((params: Params)=>{
			let page = +params['page'];
			if(!page){
				page=1;
			}else{
				this.next_page =  page+1;
				this.prev_page =  page-1;
				if(this.prev_page==0){
					this.prev_page = 1;
				}
				if(this.next_page>this.maxPage){
					this.next_page = this.maxPage;
				}
			}
			this._artistService.getArtists(this.token,page).subscribe(
				res =>{
					console.log(res)
					if(!res.artists){
						console.log("no recibo artista")
						this._router.navigate(['/'])
					}else{
					this.artists = res.artists;
					this.maxPage= Math.ceil(res.totalItems/this.artists.length)
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