uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    //Rotation
    float angle = atan(modelPosition.x, modelPosition.z);
    float distToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distToCenter) * uTime * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distToCenter;
    modelPosition.z = sin(angle) * distToCenter;

    // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= ( 1.0 / - viewPosition.z );
    vColor = color;
}