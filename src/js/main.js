class DCanvas{
    constructor(el) {
        this.ctx = el.getContext('2d')
        this.pixel = 20
        this.canv = {}
        this.is_mouse_down = false
        el.width = `500`
        el.height = `500`
        this.canv.width = parseInt(el.width);
        this.canv.height = parseInt(el.height);

        el.addEventListener('mousedown', ()=>{
            this.is_mouse_down = true;
            this.ctx.beginPath();
        })
        el.addEventListener('mouseup', ()=>{
            this.is_mouse_down = false
        })
        el.addEventListener('mousemove', (e) => {
            if (this.is_mouse_down){
                this.ctx.fillStyle = 'red'
                this.ctx.strokeStyle = 'red'
                this.ctx.lineWidth = this.pixel;

                this.ctx.lineTo(e.offsetX, e.offsetY);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(e.offsetX, e.offsetY, this.pixel / 2, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.moveTo(e.offsetX, e.offsetY);
            }
        })
    }
    drawLine(x1,y1,x2,y2, color = 'gray'){
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineJoin = 'miter';
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();
    }
    drawCell(x,y,w,h){
        this.ctx.fillStyle = 'blue';
        this.ctx.strkeStyle = 'blue';
        this.ctx.lineJoin = 'miter';
        this.ctx.lineWidth = 1;
        this.ctx.rect(x, y, w, h);
        this.ctx.fill();
    }
    clear(){
        this.ctx.clear(0,0,this.canv.width, this.canv.height)
    }
    drawGrid(){
        const w = this.canv.width;
        const h = this.canv.height;
        const p = w / this.pixel;

        const xStep = w / p;
        const yStep = h / p;

        for (let x = 0; x < w; x += xStep){
            this.drawLine(x, 0, x, h);
        }
        for (let y = 0; y < h; y += yStep){
            this.drawLine(0, y, w, y);
        }
    }
}
const d = new DCanvas(document.querySelector('#canvas'))

d.drawGrid()