var MyCardCompoment = cc.Node.extend({
	m_gameRoot: null,
	//compoment
	m_comOperator: null,
	m_operatorNum: 0,
	m_opertorOffsetX: 0,
	m_comOpertorPos: cc.p(0, 0),
	m_cardLogic: null,
	m_clickCardSound: "res/GameUI/SparrowUI/music/CLICK_CARD.mp3",
	//
	m_cardList: [],
	m_currentDispatchCard: null,
	m_currentCardNum: 0,  //还要计算当前的手牌张数？
	//texture 
	// m_twidth: 0,  //总宽
	// m_theight: 0, //总高
	m_itemWidth: 0,  //每个item的宽度
	m_itemHeight: 0, //每个item的高度
	m_offsetX: -2,
	m_offsetY: 0,

	m_beganPoint: MJ.IintHandPoint[MJ.PlayerType.bottom],
	m_moveHeight: 15, //选中牌的运动高度
	m_isHasNull: false,  //是否有上牌动作的空隙 30
	m_nullDis: 30,  				//上牌的空隙距离
	m_upLoadIdx: -1,
	m_isActive: false,   			//控制出牌，只有true的情况下才能出牌，出牌后重置
	//触摸使用的变量
	m_currentIdx: -1,
	m_isSelected: false,  //当选中一张之后
	m_isMoveRange: false, //移动到手牌区之外去了
	m_touchIdx: 0,        //点击了几次 点击两次出牌(一定时间内 未达成)

	//observer
	m_sendOutCardObserver: null,
	m_changeOutCardsColorObserver: null,
	m_changeOperateCardsColorObserver: null,
	m_showOutCardObserver: null,
	m_checkMineIsTingObserver: null,
	ctor: function(game_root)
	{
		this._super();
		this.m_gameRoot = game_root;

		this.m_comOperator = new OperateCompoment(MJ.my_seat);
		this.m_gameRoot.addChild(this.m_comOperator, this.getLocalZOrder());
		this.m_comOpertorPos = MJ.IintOperatorPoint[MJ.PlayerType.bottom];
		this.m_comOperator.setPosition(this.m_comOpertorPos);

		this.m_cardLogic = new MyCardLogic();
	},

	//observer listener
	serverSendOurCardObserver: function(observer)
	{
		//出牌observer
		this.m_sendOutCardObserver = observer;
	},
	//与选中牌牌值相同的变色
	addOutCardColorObserver: function(observer)
	{
		this.m_changeOutCardsColorObserver = observer;
	},

	addOperateCardColorObserver: function(observer)
	{
		this.m_changeOperateCardsColorObserver = observer;
	},

	addShowOutCardObserver: function(observer)
	{
		this.m_showOutCardObserver = observer;
	},

	addCheckMinIsTingObserver: function(observer)
	{
		this.m_checkMineIsTingObserver = observer;
	},

	setCurrentDispatchCard: function(card)
	{
		this.m_currentDispatchCard = card;
	},

	//初始化传入初始数据
	setInitCards: function(card_arr)
	{
		var cardArr = [];
		for (var i = 0; i < card_arr.length; i++) {
			if (card_arr[i] > 0) 
				cardArr.push(card_arr[i]);
		}
		cardArr = this._sortCardData(cardArr);
		if (this.m_currentDispatchCard) {
			for (var i = 0; i < cardArr.length; i++) {
				if (cardArr[i] == this.m_currentDispatchCard) {
					cardArr.splice(i, 1);
					break;
				}
			}
			cardArr.push(this.m_currentDispatchCard);
			this.m_currentDispatchCard = null;
		}

		this.m_cardLogic.setCardDatas(cardArr);
		for (var i = 0; i < cardArr.length; i++){
			if (cardArr[i] > 0)
				this._createMjCard(cardArr[i], i);
		}   
	},

	//清空所有手牌
	removeAllCards: function()
	{
		this.removeAllChildren();
		this.m_cardList = [];
		this.m_cardLogic.reset();
		this.m_comOperator.reset();
		this.m_operatorNum = 0;
		this.m_opertorOffsetX = 0;
		this.setPositionX(this.m_beganPoint.x);
	},

	switchTouchPointToIndex: function(event){
		var pos = event.location;
		if (event.name == "began"){
			var ret = this._ignoreNotCardRect(pos);
			if (ret == false){
				if (!this.m_isSelected) 
					this.m_currentIdx = -1;
				var idx = this._changePointToIdx(pos);
				// if (this.m_isSelected && this.m_currentIdx == idx && this.m_isActive){
				// 	//打出 两次选中同一个
				// 	this._onOutCurrentCard();
				// 	return;
				// }
				this._changeCurrentIdx(idx);
			} else {
				if (this.m_isSelected){
					//如果本来就是选中状态, 点击到手牌之外的区域，重置回来
					this.resetCurrentIdx();
				}
			}
		} else if (event.name == "moved"){
			//第一下began，必须是选中牌的状态
			//若是一开始是点击其他地方，暂时不予以任何反应
			if (this.m_isSelected){
				var ret = this._ignoreNotCardRect(pos);
				if (ret){
					//出了手牌区域
					//将当前选中这个牌做一定处理
					this.m_isMoveRange = true;
					this._moveOffCardRect(pos);
				} else {
					//没有出手牌区域,这时变换选中的牌
					if (this.m_isMoveRange){
						this._moveBackCardRect();
					}

					this.m_isMoveRange = false;
					// var idx = this._changePointToIdx(pos);
					// this._changeCurrentIdx(idx);
				}
			}		
		} else if (event.name == "ended"){
			if (this.m_isMoveRange){
				if (this.m_isActive) {
					//这种状态肯定是选中牌,并且将牌移动到手牌区之外(结果：打出)；
					this._onOutCurrentCard();
				} else {
					this._moveBackCardRect();
				}
				
			}
			this.m_isMoveRange = false;			
		}
	},

	//上牌
	uploadCard: function(card_data)
	{
		//this.resetCurrentIdx();
		//如果本身是拖出去的状态, 先重置
		if (this.m_isMoveRange) {
			this._moveBackCardRect();
			this.m_isMoveRange = false;
		}

		this.m_isActive = true;
		if (card_data){
			//一张 新创建的 默认最后位置 未排序
			this._createMjCard(card_data, this.m_cardList.length);
			this.m_cardLogic.pushCardData(card_data);
		}
		this.m_upLoadIdx = this.m_cardList-1;
		this._lastCardNeedNullX();
	},
	//出牌
	outPlayCard: function(card_data)
	{
		//简单处理 直接排序刷新
		var sort_id = -1;
		if (this.m_currentIdx != -1) {
			sort_id = this.m_cardList[this.m_currentIdx].getSortId();
		} else {
			sort_id = this._findCardSortIdInCardList(card_data);
		}
		//现在是直接删除
		var arr;
		if (this.m_showOutCardObserver){
			arr = this.m_showOutCardObserver(card_data, MJ.my_seat); 
		}
		var callback = function(){
			arr[0].setVisible(true);
			this.m_cardLogic.removeCardData(this.m_cardList[sort_id].getCardValue());
			this.m_cardList[sort_id].removeFromParent();
			this.m_cardList.splice(sort_id, 1);
			this.m_currentCardNum--;
			this.m_cardList.sort(function(a, b){ return a.getCardValue() > b.getCardValue()});
			this._resetCardListPosition();
			if (this.m_checkMineIsTingObserver)
				this.m_checkMineIsTingObserver();
			//BBAudioEngine.playEffect(this.m_sMusicPath + "OUT_CARD.mp3", false);
		}
		
		var card = this.m_cardList[sort_id];
		var point = cc.p(arr[1].x-this.m_beganPoint.x + this.m_offsetX/2, arr[1].y-this.m_beganPoint.y);
		var callfunc = cc.callFunc(callback.bind(this));
		card.runAction(cc.sequence(cc.moveTo(0.2, point), callfunc));
	},
	//logic
	getEatCardGroup: function(fCard)
	{
		return this.m_cardLogic.getEatCardGroup(fCard);
	},

	getGangGroup: function(fCard)
	{
		//上牌的时候可能会存在暗杠和续杠选择的情况
		var gangArr = [];
		//续杠或者明杠
		var xdata = this.m_cardLogic.getXuGang(fCard);
		if (xdata){
			var xObj = {data: xdata, type: MJ.OperatorType.xgang};
			gangArr.push(xObj);
		}

		var mdata = this.m_cardLogic.getMGang(fCard);
		if (mdata){
			var mObj = {data: mdata, type: MJ.OperatorType.mgang};
			gangArr.push(mObj);
		}

		//暗杠
		var adata = this.m_cardLogic.getAnGangGroup();
		for (var i = 0; i < adata.length; i++){
			var aObj = {data: adata[i], type: MJ.OperatorType.agang};
			gangArr.push(aObj);
		}
		return gangArr;
	},

	pushMyLogicPengCard: function(data) 
	{
		this.m_cardLogic.pushPengCard(data); //碰牌存储(主动)
	},

	//began 一些其他的操作结果(吃 碰 杠)
	//其实现在的方式是一样的，刷新手牌就可以
	changeCardListSubCards: function(cardArr, operateType, action_card)
	{
		operateType = Math.floor(operateType);
		this.resetCurrentIdx();
		this._addOperatorNum();
		//操作结果组件
		this.m_comOperator.createOneOperationNode(operateType, cardArr, action_card);

		if (operateType == MJ.OperatorType.peng) {
			//碰牌
			this.m_cardLogic.pushPengCard(cardArr[0]);
		}

		if (action_card){
			if (operateType == MJ.OperatorType.chi){
				//剔除掉别人那张牌
				for (var k in cardArr){
					if (cardArr[k] == action_card)
						cardArr[k] = 0;
				}
			} else if (operateType == MJ.OperatorType.peng || operateType == MJ.OperatorType.mgang){
				if (operateType == MJ.OperatorType.mgang) {
					this.m_cardLogic.removePengCard(cardArr[0]);
				}
				//s随便剔除一张 明杠
				cardArr[0] = 0;
			} else if (operateType == MJ.OperatorType.agang || operateType == MJ.OperatorType.xgang){
				//去掉四张，什么都不做
			}
			
			for (var k in cardArr){
				for (var idx in this.m_cardList){
					var cardValue = this.m_cardList[idx].getCardValue();
					if (cardValue == cardArr[k]){
						//从手牌中除去这张牌
						this.m_cardLogic.removeCardData(this.m_cardList[idx].getCardValue());
						this.m_cardList[idx].removeFromParent();
						this.m_cardList.splice(idx, 1);
						this.m_currentCardNum--;
						break;
					}
				}
			}

			this._resetCardListPosition();
			if (operateType != MJ.OperatorType.mgang && operateType != MJ.OperatorType.xgang && operateType != MJ.OperatorType.agang) {
				//杠要上牌 上牌会执行空牌
				this._lastCardNeedNullX();
			}
		}
	},
	//end 一些其他的操作结果(吃 碰 杠)
	//
	_createMjCard: function(card_data, idx)
	{
		var card = new MjCard();
		this.addChild(card);
		card.setCardValue(card_data);
		card.setJSpriteFrame(cc.formatStr(MJ.MyHandResEm, card_data));
		this.m_offsetX = card.getItemWidth();
		this.m_offsetY = card.getItemHeight();
		this.m_itemHeight = card.getItemHeight();
		this.m_itemWidth = card.getItemWidth();
		card.setPosition(cc.p((idx + 0.5) * this.m_offsetX, 0));
		card.setSordId(idx);
		this.m_currentCardNum++;
		this.m_cardList.push(card);
	},

	_idxChcek: function(idx)
	{
		if (this.m_currentCardNum > 14) {
			this.m_currentCardNum = 14;
		}
		if (idx > this.m_currentCardNum - 1){
			idx = this.m_currentCardNum - 1;
		}
		if (idx > 14) {
			idx = 13;
		}
		return idx;
	},	

	_sortCardData: function(data)
	{
		return data.sort(function(a, b){ return a > b; });
	},

	_findCardSortIdInCardList: function(card_data)
	{
		for (var i = 0; i < this.m_cardList.length; i++) {
			var card = this.m_cardList[i];
			if (card.getCardValue() == card_data) 
				return i;
		}
	},

	_lastCardNeedNullX: function()
	{
		this.m_isHasNull = true;
		//因为可能在上牌或者是刚碰完等，最后一张需要特殊设置。
		var length = this.m_cardList.length;
		var lfag = length - 1;
		this.m_cardList[lfag].setPositionX(this.m_offsetX * (lfag+0.5) + this.m_nullDis); // 30 是间隔可设置
	},

	_lastCardNotNeedNullX: function()
	{
		this.m_isHasNull = false;
		var length = this.m_cardList.length;
		var lfag = length - 1;
		this.m_cardList[lfag].setPositionX(this.m_offsetX * (lfag+0.5));
	},

	//所有的牌复位
	_resetCardListPosition: function()
	{
		for(var i = 0; i < this.m_cardList.length; i++){
			this._setCardPointBySortId(i);
			this.m_cardList[i].setSordId(i);
		}
		this.m_isHasNull = false;
	},

	_setCardPointBySortId: function(idx)
	{	
		if (this.m_cardList[idx])
			this.m_cardList[idx].setPosition(cc.p((idx + 0.5) * this.m_offsetX, 0));
	},

	//touch 相关
	_changePointToIdx: function(pos)
	{
		var _x = pos.x - X(this);
		// if (this.m_isHasNull)
		// 	_x -= this.m_nullDis;
		var idx = Math.floor(_x / this.m_offsetX);
		return idx;
	},

	//忽略掉不是手牌的区域
	_ignoreNotCardRect: function(pos)
	{
		var length = this.m_cardList.length;
		var twidth = X(this) + this.m_offsetX * length;
		if (this.m_isHasNull)
			twidth += this.m_nullDis;
		//去掉上下文左右区域
		if (pos.x < X(this) || pos.x > twidth  || pos.y < Y(this)-this.m_itemHeight / 2 || pos.y > Y(this)+this.m_itemHeight/3){
			return true;
		}
		//如果是上牌等有空隙的阶段，还要去除中空地带
		var noNullWidth = X(this) + this.m_offsetX * (length-1);
		if (this.m_isHasNull && (pos.x > noNullWidth && pos.x < noNullWidth + this.m_nullDis)){
			return true;
		}
		return false;
	},

	_changeCurrentIdx: function(idx)
	{
		//BBAudioEngine.playEffect(this.m_clickCardSound, false);
		idx = this._idxChcek(idx);
		if (this.m_currentIdx != idx){
			//换了一张牌
			if (this.m_currentIdx != -1){
				this._setCurrentIdxNotSelected();
			}
			this.m_currentIdx = idx;
			this._setCurrentIdxSelected();
		} else {
			//同一张牌
			this._addTouchIdx();
		}
	},

	resetCurrentIdx: function()
	{
		this.m_currentIdx = this._idxChcek(this.m_currentIdx);
		if (this.m_currentIdx != -1){
			this._setCurrentIdxNotSelected();
			this.m_currentIdx = -1;
			this.m_touchIdx = 0;
		}
	},	

	_addTouchIdx: function()
	{
		this.m_touchIdx++;
		if (this.m_touchIdx == 2) {
			this._onOutCurrentCard();
		}
	},

	_setCurrentIdxSelected: function()
	{
		this.m_currentIdx = this._idxChcek(this.m_currentIdx);
		if(this.m_cardList[this.m_currentIdx]) {
			this.m_isSelected = true;
			if (this.m_changeOutCardsColorObserver)
				this.m_changeOutCardsColorObserver(this.m_cardList[this.m_currentIdx].getCardValue(), true);
			if (this.m_changeOperateCardsColorObserver)
				this.m_changeOperateCardsColorObserver(this.m_cardList[this.m_currentIdx].getCardValue(), true);
			this.m_cardList[this.m_currentIdx].setPositionY(this.m_moveHeight);
			this.m_touchIdx = 1;
		}
	},

	_setCurrentIdxNotSelected: function()
	{
		if (this.m_cardList[this.m_currentIdx]) {
			this.m_cardList[this.m_currentIdx].setPositionY(0);
			this._resetChangeCardsColor();
			this.m_isSelected = false;
		}
	},

	_resetChangeCardsColor: function()
	{
		if (this.m_cardList[this.m_currentIdx]) {
			if (this.m_changeOutCardsColorObserver)
				this.m_changeOutCardsColorObserver(this.m_cardList[this.m_currentIdx].getCardValue(), false);
			if (this.m_changeOperateCardsColorObserver)
			this.m_changeOperateCardsColorObserver(this.m_cardList[this.m_currentIdx].getCardValue(), false);
		}
	},

	//打出当前选中的牌
	_onOutCurrentCard: function()
	{
		if (this.m_isActive){
			if (this.m_sendOutCardObserver)
				this.m_sendOutCardObserver(this.m_cardList[this.m_currentIdx].getCardValue(), MJ.my_seat);
			//先隐藏，如果出牌不成功应该恢复
			//this.m_cardList[this.m_currentIdx].setVisible(false);
			this.m_isSelected = false;
			this.m_isActive = false;
			this.m_isHasNull = false;
			this.m_touchIdx = 0;

			this._resetChangeCardsColor();
		}
	},

	//飞出去的牌
	_moveOffCardRect: function(pos)
	{
		if (pos.y > Y(this) + this.m_itemHeight*1.1){
			var card = this.m_cardList[this.m_currentIdx];
			card.setPosition(cc.p(pos.x - card.getItemWidth()*1.5, pos.y - card.getItemHeight()/2 - 20));
			card.setScale(1.1);
			card.setOpacity(180);
			this.setLocalZOrder(19);
		} else {
			//回来重置
			this._moveBackCardRect();
		}
	},
	//飞出去的牌收回来
	_moveBackCardRect: function()
	{
		this._setCardPointBySortId(this.m_currentIdx);
		this.m_cardList[this.m_currentIdx].setScale(1);
		this.m_cardList[this.m_currentIdx].setOpacity(255);
		this._setCurrentIdxSelected();
		this.setLocalZOrder(1);
		if (this.m_isHasNull){
			this._lastCardNeedNullX();
		}
	},

	_addOperatorNum: function()
	{
		this.m_operatorNum++;
		this.m_opertorOffsetX = this.m_operatorNum * 10;
		this.setPositionX(X(this) + this.m_opertorOffsetX);
	},	

	//SET
	setIsActive: function(ret)
	{
		this.m_isActive = ret;
	},

	getComOperator: function()
	{
		return this.m_comOperator;
	},

	getCardLogic: function()
	{
		return this.m_cardLogic;
	},

	getMyCardsData: function()
	{
		return this.m_cardLogic.getCardDatas();
	},
});