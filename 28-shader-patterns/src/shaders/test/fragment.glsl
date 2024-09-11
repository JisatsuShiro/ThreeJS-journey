#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main()
{
    // Pattern 3 & 4
    float strengthX = vUv.x;
    float strengthY = vUv.y;

    // Pattern 5
    float reverseStrength = 1.0 - vUv.y;
    // Pattern 6
    float strengthBy10 = vUv.y * 10.0;
    // Pattern 7 & 8
    float modulo = mod(vUv.y * 10.0, 1.0);
    float modulo2 = step(0.5, modulo);
    // Pattern 9
    float modulo3 = step(0.9, modulo);
    // Pattern 10
    float grid = step(0.8, mod(vUv.x * 10.0, 1.0));
    grid += step(0.8, mod(vUv.y * 10.0, 1.0));
    
    float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    barY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    //Pattern 11 & 12
    float dotGrid =  barX * barY;
    //Pattern 14
    float cornerGrid = barX + barY;
    //Pattern 15
    float plusX = step(0.4, mod(vUv.x * 10.0, 1.0));
    plusX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    float plusY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    plusY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    float plus = plusX + plusY;
    // Pattern 16 & 17
    float midVerticalBlack = abs(strengthX - 0.5);
    float midHorizontalBlack = abs(strengthY - 0.5);
    float midBlackCross = min(midHorizontalBlack, midVerticalBlack);
    //Pattern 18
    float midBlackCross2 = max(midHorizontalBlack, midVerticalBlack);
    // Pattern 19
    float middleBlackSquare = step(0.2, max(midVerticalBlack, midHorizontalBlack));
    //Pattern 20
    float bigMiddleBlackSquare = step(0.4, max(midVerticalBlack, midHorizontalBlack));
    //Pattern 21
    float gradiantX = floor(vUv.x * 10.0) / 10.0;
    //Pattern 22
    float gradiantY = floor(vUv.y * 10.0) / 10.0;
    float gradiantXY = gradiantX;
    gradiantXY *= gradiantY;
    // Pattern 23
    float cathodicTV = random(vUv);
    // Pattern 24
    vec2 gridUv = vec2(
        floor(vUv.x * 10.0) / 10.0,
        floor(vUv.y * 10.0) / 10.0
    );
    float minecraftStyleBlock = random(gridUv);
    // Pattern 25 ==> just add '+ value' to (vUv.y * 10.0) on pattern 24
    // Pattern 26
    float pat26 = length(vUv);
    float pat27 = length(vUv - 0.5);
    // Pattern 27 & 28 (the opposite)
    float pat28 = distance(vUv, vec2(0.5));
    // Pattern 29 & 30
    float pat29 = 0.015 / distance(vUv, vec2(0.5));
    vec2 lightUv = vec2(
        vUv.x * 0.2 + 0.45,
        vUv.y * 0.5 + 0.25
    );
    float pat30 = 0.015 / distance(lightUv, vec2(0.5));
    // Pattern 31
    vec2 lightUvX = vec2(
        vUv.x * 0.1 + 0.45,
        vUv.y * 0.5 + 0.25
    );
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    vec2 lightUvY = vec2(
        vUv.y * 0.1 + 0.45,
        vUv.x * 0.5 + 0.25
    );
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    float star = lightX * lightY;

    // Pattern 32 Rotation
    vec2 rotatedUV = rotate(vUv, PI * 0.25, vec2(0.5));
    
    vec2 lightUvXRotated = vec2(rotatedUV.x * 0.1 + 0.45, rotatedUV.y * 0.5 + 0.25);
    float lightXRotated = 0.015 / distance(lightUvXRotated, vec2(0.5));
    vec2 lightUvYRotated = vec2(rotatedUV.y * 0.1 + 0.45, rotatedUV.x * 0.5 + 0.25);
    float lightYRotated = 0.015 / distance(lightUvYRotated, vec2(0.5));
    float starRotated = lightXRotated * lightYRotated;

    // Pattern 33
    float blackCircle = step(0.25, distance(vUv, vec2(0.5)));
    // Pattern 34
    float blackCircle1 = abs(distance(vUv, vec2(0.5)) - 0.25);
    // Pattern 35 & 36 (opposite)
    float blackCircle2 = 1.0 - step(0.01 ,abs(distance(vUv, vec2(0.5)) - 0.25));
    // Pattern 37
    vec2 wavedUV = vec2(
        vUv.x, 
        vUv.y + sin(vUv.x * 30.0) * 0.1
    );
    float deformedCircle =  1.0 - step(0.01 ,abs(distance(wavedUV, vec2(0.5)) - 0.25));

    //Pattern 38
    vec2 wavedUV2 = vec2(
        vUv.x + sin(vUv.y * 30.0) * 0.1, 
        vUv.y + sin(vUv.x * 30.0) * 0.1
    );
    float deformedCircle2 =  1.0 - step(0.01 ,abs(distance(wavedUV2, vec2(0.5)) - 0.25));
    //Pattern 39 ==> change 38 for => sin(vUv.y * 100.0)
    //Pattern 40
    float angle = atan(vUv.x, vUv.y);
    //Pattern 41
    float angleMid = atan(vUv.x - 0.5, vUv.y - 0.5);
    //Pattern 42
    float angleMid2 = atan(vUv.x - 0.5, vUv.y - 0.5);
    angleMid2 /= PI * 2.0;
    angleMid2 += 0.5;

    //Pattern 43
    float angleMid3 = atan(vUv.x - 0.5, vUv.y - 0.5);
    angleMid3 /= PI * 2.0;
    angleMid3 += 0.5;
    angleMid3 *= 20.0;
    angleMid3 = mod(angleMid3, 1.0);

    // Pattern 44
    float angleMid4 = atan(vUv.x - 0.5, vUv.y - 0.5);
    angleMid4 /= PI * 2.0;
    angleMid4 += 0.5;
    angleMid4 = sin(angleMid4 * 150.0);

    //Pattern 45        
    float angleMid5 = atan(vUv.x - 0.5, vUv.y - 0.5);
    angleMid5 /= PI * 2.0;
    angleMid5 += 0.5;
    float sinusoid = sin(angleMid5 * 100.0);
    float radius = 0.25 + sinusoid * 0.02;
    float circle = 1.0 - step(0.01 ,abs(distance(vUv, vec2(0.5)) - radius));

    //Pattern 46 Perlin noise
    float perlinNoise = cnoise(vUv * 10.0);
    //Pattern 47
    float perlinNoise2 = step(0.0, cnoise(vUv * 10.0));

    //Pattern 48
    float perlinNoise3 = 1.0 - abs(cnoise(vUv * 10.0));
    //Pattern 49
    float perlinNoise4 = sin(cnoise(vUv * 10.0) * 20.0);
    //Pattern 50
    float perlinNoise5 = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    //Colors
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, perlinNoise5);

    float draw = perlinNoise5;
    gl_FragColor = vec4(mixedColor, 1.0);
    // gl_FragColor = vec4(draw, draw, draw, 1.0);
}