varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float dive;
uniform float swap;

vec4 tex(vec2 _uv){
	vec4 fg1 = texture2D(uSampler, _uv);
	vec4 fg2 = fg1;
	vec4 fg3 = fg1;

	fg2.rgb = mix(fg1.rgb, vec3(0.0, 0.0, 0.2), fg1.a);
	fg3.rgb = mix(fg1.rgb, vec3(1.0, 0.0, 0.0), fg1.a);
	fg2.a -= 0.25;

	return mix(mix(fg1,fg2,dive), fg3, swap);
}

void main(void){
	// get pixel
	vec2 uvs = vTextureCoord.xy;

	vec4 fg = tex(uvs);

	// output
	gl_FragColor = fg;
}