class vethu{
    constructor(){
        this.canvas = document.getElementById('DemoCanvas');
        this.ctx = this.canvas.getContext("2d");
        this.x = 0;
        this.y = 0;
        this.dk = false;
        this.cel = 2;
        this.cl = "red";
        this.listenEvent();
        this.luuanh = null;
        this.luu();
        this.tool = 'pen';
    }
    listenEvent(){

        this.canvas.addEventListener("mousedown",(event)=>{
            this.x = this.getmousepos(event).x;
            this.y = this.getmousepos(event).y;
            this.dk = true;
            this.luu();
        });
        this.canvas.addEventListener("mouseup",(event)=>{
            this.dk = false;
        });
        this.canvas.addEventListener("mousemove",(event)=>{
            
            if (this.dk) {
                switch(this.tool){

                    case 'line':
                        this.undo();
                        this.ve(this.x,this.y,this.getmousepos(event).x, this.getmousepos(event).y);
                        break;
                    case 'pen':
                        this.ve(this.x,this.y,this.getmousepos(event).x, this.getmousepos(event).y);
                        this.x = this.getmousepos(event).x;
                        this.y = this.getmousepos(event).y;
                        break;
                    case 'rect':
                        this.undo();
                        this.verect(this.x,this.y,this.getmousepos(event).x, this.getmousepos(event).y);
                        break;
                    }
            }
            
        });
        
    }
    verect(x,y,posX, posY){
        this.ctx.beginPath();
        this.ctx.lineWidth = this.cel;
        this.ctx.strokeStyle = this.cl;
        this.ctx.rect(x,y,posX-x, posY-y);
        this.ctx.stroke();

    }
    getmousepos(event){
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    
    }
    ve(x,y,posX, posY){
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(posX, posY);
        this.ctx.lineWidth = this.cel;
        this.ctx.strokeStyle = this.cl;
        this.ctx.stroke();

    }
    drawB(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
    undo(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.drawImage(this.luuanh,0,0,this.canvas.width,this.canvas.height);
    }
    luu(){
        this.luuanh = new Image(); 
        this.luuanh.src = this.canvas.toDataURL("image/png");
        //document.body.appendChild(this.luuanh); 
    }
}
var v = new vethu();



