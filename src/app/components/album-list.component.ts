import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';


@Component({
	selector: 'album-lista',
	templateUrl: '../views/album-list.html',
	providers: [UserService,AlbumService]
})

export class AlbumListComponent implements OnInit{
	public titulo: string;
	public albums: Album[];
	public identity;
	public token;
	public url: string;
	public urlfile: string;
	public next_page;
	public prev_page;
	public alertMessage;
	public maxPage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
	){
		this.titulo = 'Albums';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.urlfile = GLOBAL.urlfile;
		this.next_page =1;
		this.prev_page =1;
		this.maxPage=10;
	}
	ngOnInit(){
		this.getAlbums();
	}
	public confirmado;
	onDeleteConfirm(id){
		this.confirmado=id;
	}
	onCancelAlbum(){
		this.confirmado=null;
	}
	onDeleteAlbum(id){
		this._albumService.deleteAlbum(this.token,id).subscribe(
				res =>{
					console.log(res)
					if(!res.albumRemoved){
						this.alertMessage="Error al eliminar el album";
					}
					this.getAlbums();
				},
				error=>{
					var errorMessage = <any>error;
			  		if (errorMessage != null) {
			  			var body = JSON.parse(error._body)
			  			this.alertMessage=body.message
			  			}
				})
	}


	getAlbums(){
		this._route.params.forEach((params: Params)=>{
			let artist = params['artist'];

			if(!artist){
				artist='';
			}

		/*	if(!page){
				page=1;
			}else{
				this.next_page =  page+1;
				this.prev_page =  page-1;
				if(this.prev_page==0){
					this.prev_page = 1;
				}
				if(this.next_page>this.maxPage){
					this.next_page = this.maxPage;
				}*/
			
			this._albumService.getAlbums(this.token,artist).subscribe(
				res =>{
					console.log(res)
					if(!res.albums){
						console.log("no recibo albums")
						this._router.navigate(['/'])
					}else{
					this.albums = res.albums;
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
		})
	}
}