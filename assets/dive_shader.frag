varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float dive;

vec4 tex(vec2 _uv){
	vec4 fg1 = texture2D(uSampler, _uv);
	vec4 fg2 = texture2D(uSampler, _uv);

	fg2.rgb = mix(fg2.rgb, vec3(0.0, 0.0, 0.2), fg2.a);
	fg2.a -= 0.25;

	return mix(fg1,fg2,dive);
}

void main(void){
	// get pixel
	vec2 uvs = vTextureCoord.xy;

	vec4 fg = tex(uvs);

	// output
	gl_FragColor = fg;
}