import {Component,OnInit} from '@angular/core';
import {Song} from '../models/song';
import { GLOBAL } from '../services/global'

@Component({
	selector: 'player',
	template:`
	<div class="player-div">
	<div class="progress" id="progress" (click)="updateSeek($event)">
		<div  [ngStyle]="{'width.%':percentage}" class="percent"></div>
	</div>
		<div class="album-image">
			<span *ngIf="song.album">
				<img id="play-image-album" src="{{urlfile+song.album.image}}">
			</span>
			<span *ngIf="!song.album">	
				<img id="play-image-album" src="{{'../assets/images/note.png'}}"/>
			</span>
		</div>
		<div class="audio-file">
			<span>Reproduciendo</span>
			<span id="play-song-title" >
				
			</span>
			<span id="play-song-artist" >
				<span>
					
				</span>
			</span>
		</div>
		<div id="controls">
			<span class="fas fa-step-backward nbbut"></span>
			<span class="button fas fa-play" id="ppbut" (click)="playpause()"></span>
			<span class="fas fa-step-forward nbbut"></span>
			<audio id="player" (timeupdate)="updateProgressBar()" >
				<source id="mp3-source" src="{{urlfile+song.file}}" type="audio/mpeg">
				Tu navegador no es compatible
			</audio>
		</div>
	</div>

	`
})

export class PlayerComponent implements OnInit{

	public url: string;
	public song;
	public percentage;
	public urlfile: string;

	constructor(){
		this.url = GLOBAL.url;
		this.song=new Song("","","","","")
		this.urlfile = GLOBAL.urlfile;
		this.percentage;
		window.onload=this.load;

		


	}

	ngOnInit(){
		console.log("el reproductor esta cargado")

	}
	updateSeek(event){
		console.log(event)
		var target=document.getElementById('progress')
		var parent=target.parentElement.offsetLeft

	    var test = (event.clientX-parent) / target.offsetWidth;
/*	    console.log(event.clientX)
	    console.log(parent)
	    console.log(target.clientWidth)*/
		var player=(document.getElementById("player") as HTMLMediaElement)

		player.currentTime=test*player.seekable.end(0)
	}
	onPlay(){
		var ppbut=document.getElementById("ppbut")
		ppbut.setAttribute('class',"fas fa-pause")
	}
	
	playpause(){
		var ppbut=document.getElementById("ppbut");
		let player=(document.getElementById("player")as HTMLMediaElement);
		if(ppbut.className==="fas fa-play"){
			ppbut.setAttribute('class',"fas fa-pause")
			player.play();
		}else{
			ppbut.setAttribute('class',"fas fa-play")
			player.pause();
		}
	}
	updateProgressBar() {
	   console.log("llegamos")
	   var percentage = Math.floor((100 / (document.getElementById("player") as any).duration) *
	   (document.getElementById("player") as any).currentTime);
	   this.percentage=percentage;
	}
	load(){
		var song_player=localStorage.getItem('sound_song');
		var ppbut=document.getElementById("ppbut")
		this.song=JSON.parse(song_player);
		var file_path=localStorage.getItem('sound_path');
		var image_path=localStorage.getItem('sound_image');
		if(image_path){
		var player=(document.getElementById("player") as any)
		document.getElementById('mp3-source').setAttribute("src",file_path);
		player.load();
		document.getElementById("play-song-title").innerHTML=this.song.name;
		document.getElementById("play-song-artist").innerHTML=this.song.album.artist.name;
		document.getElementById("play-image-album").setAttribute('src',image_path);}
	}


}