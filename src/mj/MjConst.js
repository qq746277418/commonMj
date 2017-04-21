var MJ = MJ || {}

MJ.my_seat = 0;  //本家位置 与下PlayerType对应
MJ.GamePlayer = 4;  //游戏人数


MJ.PlayerType = {
	bottom: 0,
	right: 1,
	top: 2,
	left: 3
}

MJ.MjType = {
	wan: 0,
	tiao: 1,
	tong: 2,
	feng: 3,
	hua: 4
}

MJ.OperatorType = {
	chi: 0,
	peng: 1,
	mgang: 3,
	agang: 4,
	xgang: 5,
	hu: 6
}

MJ.GangType = {
	mGang: 0,
	aGang: 1,
	xGang: 2
}

MJ.HuType = {
	ph: 0,  //平湖
}

//牌类型对应资源名
MJ.MyHandResEm = "xl%d.png";
MJ.CardTypeEm = ["xt%d.png", "yt%d.png", "st%d.png", "zt%d.png"];
//其他玩家手牌缓存资源名
MJ.OtherHandRes = [];
MJ.OtherHandRes[MJ.PlayerType.left] = "zl.png";
MJ.OtherHandRes[MJ.PlayerType.top] = "sl.png";
MJ.OtherHandRes[MJ.PlayerType.right] = "zl.png";

//手牌组件初始位置
MJ.W = 1280;//cc.winSize.width;
MJ.H = 720;//cc.winSize.height;
MJ.IintHandPoint = [];
MJ.IintHandPoint[MJ.PlayerType.bottom] = cc.p(110, 60);
MJ.IintHandPoint[MJ.PlayerType.right] = cc.p(MJ.W-100, MJ.H/2-130);
MJ.IintHandPoint[MJ.PlayerType.top] = cc.p(MJ.W/2+150, MJ.H-50);
MJ.IintHandPoint[MJ.PlayerType.left] = cc.p(110, MJ.H/2+150);
//操作牌组件初始位置
MJ.IintOperatorPoint = [];
MJ.IintOperatorPoint[MJ.PlayerType.bottom] = cc.p(MJ.W-60, 60);
MJ.IintOperatorPoint[MJ.PlayerType.right] = cc.p(MJ.W-100, MJ.H/2-200);
MJ.IintOperatorPoint[MJ.PlayerType.top] = cc.p(MJ.W/2+400, MJ.H-50);
MJ.IintOperatorPoint[MJ.PlayerType.left] = cc.p(110, MJ.H/2+300);
//出牌组件各家出牌起始位置
MJ.IintOutPoint = [];
MJ.IintOutPoint[MJ.PlayerType.bottom] = cc.p(MJ.W/2-283, 165);
MJ.IintOutPoint[MJ.PlayerType.right] = cc.p(MJ.W-160, 190);
MJ.IintOutPoint[MJ.PlayerType.top] = cc.p(MJ.W/2+313, MJ.H-120);
MJ.IintOutPoint[MJ.PlayerType.left] = cc.p(165, MJ.H-137);

// 1-9 万; 11-19 条; 21-29 筒; 31-37 风; 35-42 花
MJ.mjCardType = {
	NORMAL: [9,9,9,7], //正常没有花
	NOFENG: [9,9,9],  //没有风
	HAVEHUA: [9,9,9,7,9],   //有花
}

MJ.CurrentCards = MJ.mjCardType.NORMAL;
//出牌
var func_get_card_str = function(seat, value)
{
	return cc.formatStr(MJ.CardTypeEm[seat], value);
}
