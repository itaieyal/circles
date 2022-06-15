import { Component, ElementRef, ViewChild } from '@angular/core';

type Position = {
  x: number;
  y: number;
};
type Velocity = {
  x: number;
  y: number;
};

const mouse: { x?: number; y?: number } = {
  x: undefined,
  y: undefined,
};

const colorsArray = ['#520120', '#08403E', '#706513', '#B57114', '#962B09'];

class Circle {
  static maxRadius = 40;
  static minRadius = 2;

  c: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  minRadius: number;
  dx: number;
  dy: number;
  color: string;

  constructor({
    c,
    position,
    velocity,
    radius,
    minRadius,
  }: {
    c: CanvasRenderingContext2D;
    position: Position;
    velocity: Velocity;
    radius: number;
    minRadius: number;
  }) {
    this.c = c;
    this.x = position.x;
    this.y = position.y;
    this.radius = radius;
    this.minRadius = minRadius;
    this.dx = velocity.x;
    this.dy = velocity.y;
    this.color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
  }

  draw() {
    this.c.beginPath();
    this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.c.fillStyle = this.color;
    this.c.fill();
  }

  update() {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    if (
      mouse.x !== undefined &&
      mouse.y !== undefined &&
      mouse.x - this.x < 50 &&
      mouse.x - this.x > -50 &&
      mouse.y - this.y < 50 &&
      mouse.y - this.y > -50
    ) {
      if (this.radius < Circle.maxRadius) {
        this.radius += 1;
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }

    this.draw();
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // @ts-ignore
  @ViewChild('canvasEl') canvasRef: ElementRef<HTMLCanvasElement>;

  public canvas?: HTMLCanvasElement;
  public ctx?: CanvasRenderingContext2D;

  constructor() {}

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.run();
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener('resize', (event) => {
      if (this.canvas) {
        this.run();
      }
    });
  }

  run() {
    if (!this.canvas) {
      return;
    }
    if (!this.ctx) {
      return;
    }
    const c = this.ctx;
    const canvas = this.canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const circles: Circle[] = [];

    for (let i = 0; i < 800; i++) {
      const radius = Math.random() * 3 + 1;
      circles.push(
        new Circle({
          c,
          position: {
            x: Math.random() * (innerWidth - radius * 2) + radius,
            y: Math.random() * (innerHeight - radius * 2) + radius,
          },
          velocity: {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
          },
          radius,
          minRadius: radius,
        })
      );
    }

    function animate() {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < circles.length; i++) {
        circles[i].update();
      }
    }

    animate();
  }
}
