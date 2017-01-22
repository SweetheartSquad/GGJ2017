varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec2 screenSize;
uniform vec2 bufferSize;
uniform float curTime;
uniform float transition;

vec3 tex(vec2 uv){
	vec2 uvs = uv*bufferSize/screenSize;
	uvs.x += sin(uvs.x*20.0 - curTime/50.0)*transition/32.0;
	uvs.y += cos(uvs.y*20.0 - curTime/50.0)*transition/32.0;
	uvs = mod(uvs,1.0);
	uvs = uvs/bufferSize*screenSize;
	vec3 res = texture2D(uSampler, uvs).rgb;
	res += vec3(transition);
	return res;
}

void main(void){
	// get pixel
	vec2 uvs = vTextureCoord.xy;
	vec3 fg = tex(uvs);


	// output
	gl_FragColor.rgb = fg;
	gl_FragColor.a = 1.0;
}