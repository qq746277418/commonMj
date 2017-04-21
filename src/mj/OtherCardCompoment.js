// var CardDirection = {
// 	left: 1,
// 	right: 3,
// 	top: 0
// }

//主要是闭合缝隙
// var CardOffset = [];
// CardOffset[CardDirection.left] = {w: 0, h: -34};
// CardOffset[CardDirection.right] = {w: 0, h: -34};
// CardOffset[CardDirection.top] = {w: -5, h: 0};

// //又出现一个数组存了三个对象的问题。
var OtherCardAray = [];
OtherCardAray[MJ.PlayerType.left] = [];
OtherCardAray[MJ.PlayerType.right] = [];
OtherCardAray[MJ.PlayerType.top] = [];

var OtherCardNum = [];  //记录当前牌数

var OtherCardCompoment = cc.Node.extend({
	m_AI: new RuoZhiAI(),
	m_gameRoot: null,
	m_comOperator: null,
	m_opratorPos: cc.p(0, 0),
	m_type: -1,
	m_cardNum: 0,
	//m_cardList: [],
	m_itemWidth: 0,
	m_itemHeight: 0,
	m_lastDis: 30,
	m_isUpLoad: false,
	//方向
	m_cardListDirection: null,
	m_cardOffset: null,
	m_direction: 1,
	//obserer
	m_showOutCardObserver: null,
	//m_checkMineIsTingObserver: null,
	ctor: function(game_root, type)
	{
		this._super();
		this.m_type = type;
		this.m_gameRoot = game_root;

		this.m_cardListDirection = {
			top_to_bottom: 1,
			bottom_to_top: 2,
			left_to_right: 3,
			right_to_left: 4
		}
		this.m_cardOffset = [];
		this.m_cardOffset[this.m_cardListDirection.top_to_bottom] = {w: 0, h: -36};
		this.m_cardOffset[this.m_cardListDirection.bottom_to_top] = {w: 0, h: -36};
		this.m_cardOffset[this.m_cardListDirection.left_to_right] = {w: -5, h: 0};	
		this.m_cardOffset[this.m_cardListDirection.right_to_left] = {w: -3, h: 0};

		this.m_typeToDirection = [];
		this.m_typeToDirection[MJ.PlayerType.left] = this.m_cardListDirection.top_to_bottom;
		this.m_typeToDirection[MJ.PlayerType.right] = this.m_cardListDirection.bottom_to_top;
		this.m_typeToDirection[MJ.PlayerType.top] = this.m_cardListDirection.right_to_left;

		//操做牌组件
		this.m_opratorPos = MJ.IintOperatorPoint[this.m_type];
		this.m_comOperator = new OperateCompoment(this.m_type);
		this.m_gameRoot.addChild(this.m_comOperator, this.getLocalZOrder());
		this.m_comOperator.setPosition(this.m_opratorPos);
	},

	initCardNum: function(num)
	{
		this.m_cardNum = num;
		this.m_direction = this.m_typeToDirection[this.m_type];

		this._initCards();
	},

	addShowOutCardObserver: function(observer)
	{
		this.m_showOutCardObserver = observer;
	},

	removeAllCards: function()
	{
		for (var k in OtherCardAray) {
			for (var i = 0; i < OtherCardAray[k].length; i++) {
				OtherCardAray[k][i].removeFromParent();
			}
			OtherCardAray[k] = [];
		}

		this.m_cardNum = 0;
		
		this.m_comOperator.reset();
	},

	lastCardIsNeedNullX: function()
	{
		cc.assert(OtherCardAray[this.m_type] == null, "other card compoment faild");
		var clength = this.m_cardNum - 1;
		var lastCard = OtherCardAray[this.m_type][clength];
		var dis = this.m_isUpLoad? this.m_lastDis : 0;
		var point = this._getCardPositionByIdx(clength);
		if (this.m_direction == this.m_cardListDirection.top_to_bottom) {
			lastCard.setPositionY(point.y - dis);
		} else if (this.m_direction == this.m_cardListDirection.bottom_to_top) {
			lastCard.setPositionY(point.y + dis);
		} else if (this.m_direction == this.m_cardListDirection.left_to_right) {
			lastCard.setPositionX(point.x + dis);
		} else if (this.m_direction == this.m_cardListDirection.right_to_left) {
			lastCard.setPositionX(point.x - dis);
		}
	},

	uploadCard: function(card)
	{
		cc.log("没有牌----", card);
		this.m_isUpLoad = true;
		if (card){
			this._createMjCard(-1);
			this.updateCardListPoint();
			this.m_cardNum++;

			this.m_AI.playOutCard(card, this.m_type);
		}
		this.lastCardIsNeedNullX();
	},

	outPlayCard: function(card_data)
	{
		//现在是直接删除
		var num = Math.floor(Math.random(0, 1) * this.m_cardNum);

		var arr = this.m_showOutCardObserver(card_data, this.m_type); 
		arr[0].setVisible(false);
		var callback = function(){
			arr[0].setVisible(true);
			this.m_isUpLoad = false;
			OtherCardAray[this.m_type][num].removeFromParent();
			OtherCardAray[this.m_type].splice(num, 1);
			this.m_cardNum--;
			this.updateCardListPoint();
			this.lastCardIsNeedNullX();
			//BBAudioEngine.playEffect(this.m_sMusicPath + "OUT_CARD.mp3", false);
		}
		
		var card = OtherCardAray[this.m_type][num];
		var point = cc.p(0, 0);
		if (this.m_type == MJ.PlayerType.left) {
			point = cc.p(arr[1].x-X(this) + this.m_itemWidth/2, arr[1].y-Y(this));
		} else if (this.m_type == MJ.PlayerType.right) {
			point = cc.p(arr[1].x-X(this) + this.m_itemWidth/2, arr[1].y-Y(this));
		} else if (this.m_type == MJ.PlayerType.top) {
			point = cc.p(arr[1].x-X(this) + this.m_itemWidth/2, arr[1].y-Y(this));
		}
		var callfunc = cc.callFunc(callback.bind(this));
		card.runAction(cc.sequence(cc.moveTo(0.2, point), callfunc));
	},

	changeCardListSubCards: function(cardArr, operateType, action_card)
	{
		operateType = Math.floor(operateType);
		//操作结果组件
		this.m_comOperator.createOneOperationNode(operateType, cardArr, action_card);
		var num = 0;
		if (action_card){
			if (operateType == CMD_WG.OperationType.peng || operateType == CMD_WG.OperationType.chi){
				//s随便剔除一张
				num = 2;
			} else if (operateType == CMD_WG.OperationType.agang) {
				num = 4;
			} else if (operateType == CMD_WG.OperationType.xgang) {
				num = 1;
			}
			for (var i = 0; i < num; i++){
				OtherCardAray[this.m_type][i].removeFromParent();
			}
			this.m_cardNum -= num;
			OtherCardAray[this.m_type].splice(0, num);
		}
		this.updateCardListPoint();
		this.lastCardIsNeedNullX("changeCardListSubCards");
	},	

	//增加。减少牌之后 （都根据牌的长度来更新一次）
	updateCardListPoint: function()
	{
		var card_list = OtherCardAray[this.m_type];
		for (var i = 0; i < card_list.length; i++){
			var point = this._getCardPositionByIdx(i);
			if (this.m_direction == this.m_cardListDirection.top_to_bottom) {
				card_list[i].setPosition(point);
			} else if (this.m_direction == this.m_cardListDirection.bottom_to_top) {
				card_list[i].setPosition(point);
				card_list[i].setLocalZOrder(-i);
			} else if (this.m_direction == this.m_cardListDirection.left_to_right) {
				card_list[i].setPosition(point);
			} else if (this.m_direction == this.m_cardListDirection.right_to_left) {
				card_list[i].setPosition(point);
			}
		}
	},

	_createMjCard: function(idx)
	{
		
		var card = new MjCard();
		//card.setCardValue(idx);
		card.setJSpriteFrame(MJ.OtherHandRes[this.m_type]);
		this.addChild(card);
		this.m_itemWidth = card.getItemWidth() + this.m_cardOffset[this.m_direction].w;
		this.m_itemHeight = card.getItemHeight() + this.m_cardOffset[this.m_direction].h;

		if (idx < 0) {
			idx = this.m_cardNum;
		}
		if (this.m_direction == this.m_cardListDirection.bottom_to_top) {
			card.setLocalZOrder(-idx);
		}
		if (this.m_type == MJ.PlayerType.right)
			card.getSprite().setFlippedX(true);
		card.setPosition(this._getCardPositionByIdx(idx));
		OtherCardAray[this.m_type].push(card);
		return card;
	},

	_getCardPositionByIdx: function(idx)
	{
		if (idx == null)
			idx = 0;
		var DisOffset = [];
		DisOffset[MJ.PlayerType.left] = 80;
		DisOffset[MJ.PlayerType.right] = -30;
		DisOffset[MJ.PlayerType.top] = [];

		var comOperatorDis = 90;
		var operatorNum = this.m_comOperator.getOperatorNum()[this.m_type];
		var disNum = operatorNum > 0? 1: 0;
		if (this.m_direction == this.m_cardListDirection.top_to_bottom) {
			var operatorH = -operatorNum * comOperatorDis + DisOffset[this.m_type] * disNum;
			return cc.p(0, -idx*this.m_itemHeight + operatorH)//this.m_comOperator.getCurrentY()+184 - idx * this.m_itemHeight);
		} else if (this.m_direction == this.m_cardListDirection.bottom_to_top) {
			var operatorH = operatorNum * comOperatorDis + DisOffset[this.m_type] * disNum;
			return cc.p(0, idx*this.m_itemHeight+operatorH)//this.m_comOperator.getCurrentY()-40 + idx * this.m_itemHeight);
		} else if (this.m_direction == this.m_cardListDirection.left_to_right) {
			return cc.p(this.m_curOffsetX + idx * this.m_itemWidth, 0);
		} else if (this.m_direction == this.m_cardListDirection.right_to_left) {
			return cc.p(this.m_comOperator.getCurrentX() + 124 - idx * this.m_itemWidth, 0);
		}
	},

	_initCards: function()
	{
		for (var i = 0; i < this.m_cardNum; i++){
			var card = this._createMjCard(i);
		}
	},

	getComOperator: function()
	{
		return this.m_comOperator;
	},

	//ai 独立出去的，开始是没有的
	getAI: function()
	{
		return this.m_AI;
	}
});