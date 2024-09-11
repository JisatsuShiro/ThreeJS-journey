// uniform mat4 projectionMatrix; // about coordinates transformation (rotation, position and scale)
// uniform mat4 viewMatrix; // about CAMERA transformation (rotation, position and scale)
// uniform mat4 modelMatrix; // about MESH transformation (rotation, position and scale)
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
attribute float aRandom;
// attribute vec2 uv;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

// Function
float loremIpsum() {
    float test = 1.0;
    float retest = 2.0;

    return test + retest;
}

void main()
{
    // Typed
    float a = 1.0;
    float b = 2.0;
    float c = a + b;

    int d = 12;
    int e = -1;
    int f = d * e;

    // Type conversion
    float a1 = 1.0;
    int a2 = 2;
    float a3 = a * float(b);

    // Vector2
    vec2 foo = vec2(1.0, 2.0); // cant be empty!
    foo.x = 0.0;
    foo.y = 1.0;
    foo *= 2.0; // => multiply the X AND the Y!

    // Vec3 and colors
    vec3 purpleColor = vec3(0.0);
    purpleColor.r = 0.5;
    purpleColor.b = 1.0;

    vec2 toVec3 = vec2(1.0, 2.0);
    vec3 fromVec2 = vec3(toVec3, 3.0);

    vec2 vec2Fromvec3 = fromVec2.xy; // Taking both values ginven from a vec3 to create new vec2 (can be x, y or z)!!

    // vec4
    vec4 vector4 = vec4(0.0, 1.0, 2.0, 3.0);

    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    // ORDER: position => apply MODELMATRIX on POSITION => apply VIEWMATRIX on it => then apply PROJECTIONMATRIX

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = (sin(modelPosition.x * uFrequency.x + uTime)) * 0.1; // ==> transfrom plane into a wave
    elevation += (sin(modelPosition.y * uFrequency.y + uTime)) * 0.1; // ==> transfrom plane into a wave

    // modelPosition.z += aRandom * 0.1; // apply an attribute we've added to the geometry
    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // vRandom = aRandom;
    vUv= uv;
    vElevation = elevation;
}