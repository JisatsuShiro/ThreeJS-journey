uniform float uTime;
uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    //Re-Normalize normals
    vec3 normal = normalize(vNormal);
    //Backside ==> invert normals only for the backside
    if(!gl_FrontFacing) {
        normal *= -1.0;
    }
    //Stripes
    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    //Fresnel Effect
    // calculate vector from camera position to model position 
    // then normalize it to compare it to the normal vector
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    //Falloff
    float falloff = smoothstep(0.8, 0.0, fresnel);
    
    //Holograms
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;
    
    gl_FragColor = vec4(uColor, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}