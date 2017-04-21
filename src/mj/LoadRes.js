var MjRes = {};
var MjPath = "res/mj/"
MjRes.myPlist = {plist: MjPath + "my.plist", image: MjPath + "my.png"};
MjRes.stPlist = {plist: MjPath + "st.plist", image: MjPath + "st.png"}; // top
MjRes.ytPlist = {plist: MjPath + "yt.plist", image: MjPath + "yt.png"}; // right
MjRes.ztPlist = {plist: MjPath + "zt.plist", image: MjPath + "zt.png"}; // left
MjRes.xtPlist = {plist: MjPath + "xt.plist", image: MjPath + "xt.png"}; // bottom

var MjLoadRes = function()
{
	var sPlists = [MjRes.myPlist, MjRes.stPlist, MjRes.ytPlist, MjRes.ztPlist, MjRes.xtPlist];
	for (var i = 0; i < sPlists.length; i++) {
		var Res = sPlists[i];
		cc.spriteFrameCache.addSpriteFrames(Res.plist, Res.image);
	}
	
}

MjLoadRes();