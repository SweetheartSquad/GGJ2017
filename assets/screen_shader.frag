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
	res = mix(res, vec3(0.0,1.0,1.0), transition);
	return res;
}

void main(void){
	// get pixel
	vec2 uvs = vTextureCoord.xy;
	vec3 fg = tex(uvs);

	float v = 0.002*sin(uvs.x*20.0 + curTime/500.0)*cos(uvs.y*20.0 + curTime/500.0);
	v += 0.002*sin(uvs.x*30.0 + curTime/800.0)*cos(uvs.y*10.0 + curTime/700.0);
	v += 0.002*sin(uvs.x*40.0 + curTime/900.0)*cos(uvs.y*50.0 + curTime/600.0);
	fg = tex(uvs);

	fg = mix(fg, tex(uvs + vec2(v,v)), 0.2);
	fg = mix(fg, tex(uvs + vec2(-v,v)), 0.2);
	fg = mix(fg, tex(uvs + vec2(v,-v)), 0.2);
	fg = mix(fg, tex(uvs + vec2(-v,-v)), 0.2);
	fg += abs(vec3(v*50.0));
	if(fg.b > 0.5){
		if(fg.r+fg.g < 0.5){
			fg.g += 1.0;
		}else{
			fg.g += 0.25;
		}
	}


	// output
	gl_FragColor.rgb = fg;
	gl_FragColor.a = 1.0;
}