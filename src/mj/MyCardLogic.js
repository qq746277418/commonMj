//碰牌logic加， 碰完目标牌属于手牌
//只有出牌 手牌才会减少

//计胡
/*
	吃||碰  （平胡）
	清一色（平和）

	七小对
	龙七对（七小对的基础上，至少一根）
	清一色七小对
	清一色龙七对
	
	大碰对(碰碰和)
	清一色大碰对
	风一色大碰对

	十三幺：东，南，西，北，中，发，白，一万，九万，一筒，九筒，一梭，九梭，

	门前清 （暗杠不算）
	
*/
var MYCARD_LOGIC_DEBUG = false;
var MyCardLogic = cc.Class.extend({
	m_cardData: null, 
	m_cardPeng: [],   //碰要记录，用于查询碰杠
	m_splitCards: [],

	//胡牌分析部分
	m_cardDataClone: null,
	m_splitCloneCards: [],
	m_totalNum: 0,
	m_countGRoot: 0,  //计根 (所有属于用户牌部分只要有四张的计一根)
	m_countChi: 0,    //是否吃过牌
	m_isPureColor: false,  //是否清一色

	ctor: function()
	{
		
	},

	reset: function()
	{
		this.m_cardData = null;
		this.m_cardPeng = [];
		this.m_splitCards = [];

		this.m_cardDataClone = [];
		this.m_splitCloneCards = [];
		this.m_totalNum = 0;
		this.m_countGRoot = 0;
		this.m_countChi = 0;
		this.m_isPureColor = false;
	},

	setCardDatas: function(data)
	{
		this.m_cardData = data;
		this._spliteCardData();
	},

	getCardDatas: function()
	{
		return this.m_cardData;
	},

	pushCardData: function(data)
	{
		this.m_cardData.push(data);
		if (this.m_splitCards[data] == null)
			this.m_splitCards[data] = 0;
		this.m_splitCards[data]++;
	},

	removeCardData: function(data)
	{
		this.m_splitCards[data]--;
		for (var k in this.m_cardData){
			if (this.m_cardData[k] == data){
				this.m_cardData.splice(k, 1);
				return;
			}
		}
	},

	//碰牌要单独存起来 获取可杠组合的时候需要遍历碰的组合[只存储一张数据]
	pushPengCard: function(data)
	{
		this.m_cardPeng.push(data);
	},

	removePengCard: function(data)
	{
		for (var i = 0; i < this.m_cardPeng.length; i++) {
			if (this.m_cardPeng[i] == data) {
				this.m_cardPeng.splice(i, 1);
			}
		}
	},
	//如果碰牌杠掉去了,对应的删除这里

	//获取可吃组合
	getEatCardGroup: function(fData)
	{
		var eatGroup = [];
		//left
		if (this.m_splitCards[fData+1] > 0 &&　this.m_splitCards[fData+2] > 0){
			//可吃组合
			eatGroup.push([fData, fData+1, fData+2]);
		}
		//center
		if (this.m_splitCards[fData-1] > 0 &&　this.m_splitCards[fData+1] > 0){
			//可吃组合
			eatGroup.push([fData-1, fData, fData+1]);
		}
		//right
		if (this.m_splitCards[fData-1] > 0 &&　this.m_splitCards[fData-2] > 0){
			//可吃组合
			eatGroup.push([fData-2, fData-1, fData]);
		}
		return eatGroup;
	},

	// 获取可碰组合(可碰只有一个)
	getPengCardGroup: function(fData)
	{
		if (this.m_splitCards[fData] > 2)
			return [this.m_splitCards[fData][0], this.m_splitCards[fData][1]];
	},

	getAnGangGroup: function(fData)
	{
		var anGang = [];
		for (var k in this.m_splitCards){
			if (this.m_splitCards[k] == 4){
				anGang.push(k);
			}
		}
		return anGang;
	},

	//只会有一个
	getXuGang: function(fData)
	{
		//不一定是剛摸上來的牌啊。
		for (var i = 0; i < this.m_cardPeng.length; i++) {
			for (var j = 0; j < this.m_cardData.length; j++) {
				if (this.m_cardData[j] == this.m_cardPeng[i]) {
					//檢測有杠
					return this.m_cardData[j];
				}
			}
		}
	},	

	//只会有一个 (杠别人出的牌)
	getMGang: function(fData)
	{
		for (var k in this.m_splitCards){
			if (this.m_splitCards[k] == 3 && k == fData){
				return fData;
			}
		}
	},

	//
	//	...
	//
	_spliteCardData: function()
	{
		this.m_splitCards = [];
		for (var k in this.m_cardData){
			var value = this.m_cardData[k];
			if (this.m_splitCards[value] == null)
				this.m_splitCards[value] = 0;
			this.m_splitCards[value]++;
		}
	},

	//
	//听牌胡牌分析部分
	//
	//普通胡牌检测
	_splitCloneData: function()
	{
		this.m_splitCloneCards = [];
		this.m_totalNum = 0;
		for (var k in this.m_cardDataClone){
			this.m_totalNum++;
			var value = this.m_cardDataClone[k];
			if (this.m_splitCloneCards[value] == null)
				this.m_splitCloneCards[value] = 0;
			this.m_splitCloneCards[value]++;
		}
	},

	//这里没管听的是什么牌型，仅仅检测是否已经听
	beganCheckHu: function(card_data)
	{
		//检测手牌张数是否小相公
		this.m_cardDataClone = []; //gl.CopyMemory(this.m_cardData, this.m_cardData.length);  //每次检测克隆一份牌数据去检测
		for (var k in this.m_cardData) {
			var value = this.m_cardData[k];
			if (value != null) {
				this.m_cardDataClone.push(value);
			}
		}
		if (card_data > 0) {
			this.m_cardDataClone.push(card_data);
		}

		this.m_cardDataClone.sort(function(a, b) { return a > b; });

		var cardNum = this.m_cardDataClone.length - 2;
		if (cardNum % 3 != 0) {
			//小相公 不和
			return false;
		}
		if (MYCARD_LOGIC_DEBUG) {
			dump(this.m_cardDataClone)
			cc.log("----------当前牌的内容----------");
		}
		
		this._splitCloneData();  //分割

		//特殊牌型
		if (this._specialCardStyleTingCheck()) {
			return true;
		}

		//普通牌型
		//必须有一对将牌 否则不和 (去掉一对将牌)
		for (var k in this.m_splitCloneCards){
			var num = this.m_splitCloneCards[k];
			if (num >= 2) {
				//出去这一对将牌
				this.m_splitCloneCards[k] -= 2;
				this.m_totalNum -= 2;
				//分析
				var ret = this._analysisCards();
				if (ret == true){
					return ret;
				}
				//恢复这一对将牌
				this.m_splitCloneCards[k] += 2;
				this.m_totalNum += 2;
			}
		}
	},

	_analysisCards: function()
	{
		var result = false;
		if (MYCARD_LOGIC_DEBUG) {
			cc.log("------执行了几次递归-------", this.m_totalNum)
			dump(this.m_splitCloneCards)
		}

		if (this.m_totalNum == 0) {
			return true;
		}
		
		var length = this.m_cardDataClone.length;
		for (var i = 0; i < length-2; i++){
			//去掉连续牌(递归)
			var cdata = this.m_cardDataClone[i];
			var fnum = this.m_splitCloneCards[cdata];
			var fnum1 = this.m_splitCloneCards[cdata + 1];
			var fnum2 = this.m_splitCloneCards[cdata + 2];
			//cdata 不能是风牌
			var str = toHex(cdata).toString();
			var type = parseInt(str.slice(2, 3));
			if (type != 3 && fnum > 0 && fnum1 > 0 && fnum2 > 0) {  //还不允许是风牌
				this.m_splitCloneCards[cdata]--;
				this.m_splitCloneCards[cdata+1]--;
				this.m_splitCloneCards[cdata+2]--;
				this.m_totalNum -= 3;
				if (MYCARD_LOGIC_DEBUG) {
					cc.log("-----------去掉三张连续牌-----------", this.m_totalNum)
					dump(this.m_splitCloneCards)
				}
				result = this._analysisCards();
				this.m_splitCloneCards[cdata]++;
				this.m_splitCloneCards[cdata+1]++;
				this.m_splitCloneCards[cdata+2]++;
				this.m_totalNum += 3;
				return result;
			}

			//去掉三张
			if (fnum == 3) {
				this.m_splitCloneCards[cdata] -= 3;
				this.m_totalNum -= 3;
				if (MYCARD_LOGIC_DEBUG) {
					cc.log("-----------去掉三张刻字-----------", this.m_totalNum)
					dump(this.m_splitCloneCards)
				}
				result = this._analysisCards();
				this.m_splitCloneCards[cdata] += 3;
				this.m_totalNum += 3;
				return result;
			}
		}
		

		return false;
	},

	//特殊牌型检测
	_specialCardStyleTingCheck: function()
	{
		if (this.m_cardData.length != 13) 
			return false;
		//七对
		if (this._xiaoQiDui()){
			return true;
		}

		if (this._shiSanYao()) {
			return true;
		}
		return false;
	},

	_xiaoQiDui: function()
	{
		//龙七对是 七小对的特殊情况()
		for (var k in this.m_splitCloneCards) {
			var num = this.m_splitCloneCards[k];
			if (num != 2 || num != 4) {
				return false;
			}
		}
		return true;
	},

	//十三幺：东，南，西，北，中，发，白，一万，九万，一筒，九筒，一梭，九梭，
	_shiSanYao: function()
	{
		//var cardArr = [0x01, 0x09, 0x11, 0x19, 0x21, 0x29, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37];
		var cardArr = [1, 9, 17, 25, 33, 41, 49, 50, 51, 52, 53, 54, 55];
		var duiZi = 0;  //记录一次对子（只能有一次）
		for (var i = 0; i < cardArr.length; i++) {
			if (this.m_splitCloneCards[cardArr[i]] > 3) 
				return false;
			if (this.m_splitCloneCards[i] == null || this.m_splitCloneCards[i] == 0) {
				return false;
			}
			if (this.m_splitCloneCards[cardArr[i]] == 2) {
				duiZi++;
				if (duiZi > 1) {
					return false;
				}
			}
		}
		return true;
	},
});