"use strict";var data={},intermediate_data={};function fileRead(e){return data={},intermediate_data={},new Promise((t,a)=>{let n=new FileReader;n.addEventListener("load",(function(){t(n.result)})),n.readAsText(e)})}function bodyParse(e,t){let a=e.match(/<body>([^]*)<\/body>/)[1].replace(/title/g,"h2");return t&&(a=a.replace(/<image.l:href="#([^"]*)".>/g,(e,a)=>{let n=t.find(e=>e.key==a),r=!!n&&n.bin;return r?`<img src="${base64(r)}">`:""})),a}function getFileProcessor(e){return-1!=e.name.indexOf(".fb2")?fb2:-1!=e.name.indexOf(".txt")?txt:-1!=e.name.indexOf(".epub")&&epub}const base64=e=>"data:image/jpeg;base64,"+btoa(atob(e)),xmlParse=e=>(new DOMParser).parseFromString(e,"text/xml"),fb2={read(e){return new Promise((t,a)=>{fileRead(e).then(e=>{let a=this.imgExtract(e);this.getTitle(e,t),this.getContent(e,a,t),this.getCover(e,a,t)})})},getTitle(e,t){let a=e.match(/<book-title>(.*?)<\/book-title>/)[1];data.title=a,this.isCompleted()&&t(data)},imgExtract(e){let t=e.match(/<binary[^>]*>[^<]*<\/binary>/g);return t&&(t=t.map(e=>({bin:e.match(/>([^]*)</)[1],key:e.match(/id="([^"]*)"/)[1]}))),t||!1},getCover(e,t,a){let n=e.match(/<coverpage>([^]*)<\/coverpage>/),r="";null!=n&&t&&(n=n[1].match(/l:href="#([^"]*)"/)[1],r=t.find(e=>e.key==n),r=!!r&&base64(r.bin)),data.cover=r||"",this.isCompleted()&&a(data)},getContent(e,t,a){let n=bodyParse(e,t);data.content=n,this.isCompleted()&&a(data)},isCompleted(){let{title:e,content:t,cover:a}=data;return t&&e&&null!=a}},txt={read(e){return new Promise((t,a)=>{fileRead(e).then(a=>{data.title=e.name,data.content=this.contentProcess(a),t(data)})})},contentProcess:e=>e.split("\n").map(e=>`<p>${e}</p>`).join("")},epub={read(e){return new Promise((t,a)=>{intermediate_data.file=JSZip().loadAsync(e),intermediate_data.file.then(e=>{e.file("toc.ncx").async("string").then(e=>{this.tocExtract(e,t),this.getCover(t)})})})},tocExtract(e,t){let a=(s=e,(new DOMParser).parseFromString(s,"text/xml")),n=a.querySelector("docTitle text").textContent,r=a.querySelectorAll("navPoint"),i=[];var s;r.forEach(e=>{let t=e.querySelector("content").attributes.src.value;t=-1!=t.indexOf("#")?t.slice(0,t.indexOf("#")):t,i.find(e=>e==t)||i.push(t)}),intermediate_data.chapters=i,data.title=n,this.getChapters(t)},getCover(e){intermediate_data.file.then(t=>{let a=t.files,n=Object.keys(a).find(e=>-1!=e.indexOf("cover")&&-1==e.indexOf(".xhtml"));t.file(n).async("base64").then(t=>{data.cover=base64(t),this.isCompleted()&&e(data)})})},getChapters(e){let{chapters:t,file:a}=intermediate_data,n=[];t.forEach((r,i)=>{a.then(a=>{a.file(r).async("string").then(a=>{n[i]=this.chapterProcess(a),n.length==t.length&&(intermediate_data.content=n.join(""),this.chaptersImgLoader(e))})})})},chapterProcess:e=>`<section>${e.replace(/\n/g,"").replace(/h[0-9]/g,"h2").replace(/href="([^"]*)"/g,(e,t)=>`href="${t.slice(t.indexOf("#"))}"`).match(/<body[^>]*>(.*)<\/body>/)[0]}</section>`,chaptersImgLoader(e){let{content:t,file:a}=intermediate_data,n=[],r=t.match(/<img[^>]*>/g);r&&r.map(e=>e.match('src="([^"]*)"')[1]).forEach((i,s)=>{a.then(a=>{a.file(i).async("base64").then(a=>{n.push({src:i,bin:base64(a)}),n.length==r.length&&(data.content=t.replace(/src="([^"]*)"/g,(e,t)=>`src="${n.find(e=>e.src==t).bin}"`),this.isCompleted()&&e(data))})})}),r||(data.content=t),this.isCompleted()&&e(data)},isCompleted:fb2.isCompleted};onmessage=e=>{let t=e.data,a=getFileProcessor(t);a?a.read(t).then(postMessage):postMessage({error:"Не коректный формат файла."})};