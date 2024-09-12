varying vec3 vColor;

void main() {
    // Disc
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = 1.0 - step(0.5, strength);

    // Difuse point pattern
    // float strengthDiffused = distance(gl_PointCoord, vec2(0.5));
    // strengthDiffused *= 2.0;
    // strengthDiffused = 1.0 - strengthDiffused;
    
    // Light point
    float lightPoint = distance(gl_PointCoord, vec2(0.5));
    lightPoint = 1.0 - lightPoint;
    lightPoint = pow(lightPoint, 10.0);

    // Color
    vec3 finalColor = mix(vec3(0.0), vColor, lightPoint);
    
    gl_FragColor = vec4(finalColor, 1.0);

    #include <colorspace_fragment>

}