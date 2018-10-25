import { Injectable } from '@angular/core';
import { Http,Response,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global'
import { Album } from '../models/album'
import { Artist } from '../models/artist'
@Injectable()
export class  AlbumService{
	public identity;
	public token;
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	addAlbum(token, album: Album){
		let params = JSON.stringify(album);
		//console.log("Parametros peticion: "+params)
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		return this._http.post(this.url+'album',params,{headers}).map(res => res.json());
	}

	getAlbums(token, page){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		let options = new RequestOptions({headers: headers});


		return this._http.get(this.url+'albums/'+page,options).map(res => res.json());
	}

	getAlbum(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		let options = new RequestOptions({headers: headers});
		return this._http.get(this.url+'album/'+id,options).map(res => res.json());
	}

	editAlbum(token, id: string ,album: Album){
		let params = JSON.stringify(album);
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		let options = new RequestOptions({headers: headers});
		return this._http.put(this.url+'album/'+id,params,options).map(res => res.json());
	}
	deleteAlbum(token, id: string){
		let headers = new Headers({
			'Content-Type':'application/json',
			'Authorization': token,
		});
		let options = new RequestOptions({headers: headers});
		return this._http.delete(this.url+'album/'+id,options).map(res => res.json());
	}

}