 /*
 <<base部分 麻将类游戏通用>> 
 <<module>> 
1.【 MjCard.js 】 {
 	des：牌节点。每一张麻将牌可能都需要特殊定制[可能是拼凑的],这里所有的麻将牌都是使用此类创建.
 	整图资源方法:<具体属性查看类>
 		<setJTexture>: 设置一张整图资源进来,如果是以这种方式设置麻将资源那么顺带必须设置一下几点<目前是这种方式>
 		1.<setItemWidthAndHeight>: 必须要有每张麻将牌的宽度和高度 
		2.每张牌在整图资源中的rect位置, 当前牌的数据是十六进制数据[0x%d%d];
			1)第一个数字代表类型<万,条,筒,风,花>, 也表示在整图资源中的"纵"向位置;
			2)第二个数字代表牌值, 也表示在整图资源中的"横"向位置;
			对应方法:
			 <setCardValue>: 设置牌的10禁止数据;
			 <setCardValue16>: 设置牌的16禁止数据,将十进制数据转换0x01的格式,方便分解;
			 <_countType>: 分解16进制牌值,得到牌的类型<纵>和牌值<横>;
			 <drawTextureRectByMine>: 根据横纵向位置得到rect,绘画麻将牌;
			 <drawTextureRect>: 通过自定义一个rect绘画麻将牌;
	<setJSpriteFrame>: 通过缓存帧对象初始化麻将牌;
	<setJSpriteTexture>：通过单张的散图绘画麻将牌;

2.【 MyCardCompoment.js 】
 	des: 手牌组件，里面有OperateCompoment组件和MyCardLogic逻辑类
 	方法：
 		外部函数：
 			<setCardOpertatorPoint>: 设置操作牌的起始位置<包括碰、杠、吃>
 			<setBeganPoint>：手牌的起始位置,在执行一些操作之后组件位置会稍有变动
 			<serverSendOurCardObserver>: 出牌
 			<addOutCardColorObserver>: 查看选中牌对应的出牌
 			<addOperateCardColorObserver>: 查看选中牌对应操作明牌
 			<addShowOutCardObserver>: 展示出牌过程,这里做了出牌动画，对应执行出牌组件方法
 			<addCheckMinIsTingObserver>: 每次自己出牌都要检测一次自己是否已听牌
 			<setInitCards>: 初始化手牌数据
 			<removeAllCards>: 手牌组件重置
 			<switchTouchPointToIndex>: 触摸核心方法,选牌、出牌、拖动牌
 			<uploadCard>: 当上牌时组件变化
 			<outPlayCard>：当出牌时组件变化
 			<getEatCardGroup>: 获取手牌中所有吃的组合，来自MyCardLogic.js类
 			<getGangGroup>:获取手牌中杠的组合，来自MyCardLogic.js类
 			<pushMyLogicPengCard>: 存储碰组合，因为碰可续杠；
 			<changeCardListSubCards>：不论吃、碰、杠导致手牌变化都走这里
 			<setIsActive>：设置组件活动状态
 			<getComOperator>： 获取挂载的操作牌组件
 			<getCardLogic>：获取手牌逻辑类
 			<getMyCardsData>：获取收数据
 		内部函数:
 			<_createMjCard>: 创建一张麻将牌
 			<_sortCardData>：给传入手牌数据排序
 			<_findCardSortIdInCardList>：通过牌值找到一张牌的sortid<sort_id：在组件的位置>
 			<_lastCardNeedNullX>：轮到自己出牌时,最后一张牌应空出一定位置
 			<_lastCardNotNeedNullX>：回收最后一张牌空出的位置
 			<_resetCardListPosition>：所有牌复位
 			<_setCardPointBySortId>：通过sord_id获取在组件中的位置
 			<_changePointToIdx>：将点击位置转为组件牌的sort_id
 			<_ignoreNotCardRect>：检测出点击位置是否处在手牌组件区域
 			<_changeCurrentIdx>: 更改选中sort_id
 			<resetCurrentIdx>：重置选中的sort_id
 			<_addTouchIdx>: 自增数据，用于判断同一张牌是否选中两次，是(处在活动阶段)则打出
 			<_setCurrentIdxSelected>：将选中的牌向上移动
 			<_setCurrentIdxNotSelected>：将选中的牌重置回去
 			<_resetChangeCardsColor>: 重置选中牌对应明牌
 			<_onOutCurrentCard>：打出当前选中的牌
 			<_moveOffCardRect>：拖动牌脱离组件区域
 			<_moveBackCardRect>：将拖动且脱离组件区域的牌重置
 			<_addOperatorNum>: 统计有几次操作牌<碰、杠、吃等>
3.【 MyCardLogic.js 】
	des: 手牌数据逻辑类，用于获取吃、碰、杠的组合，续杠数据和听胡检测等
 	方法：
 		外部函数：
			<reset>: 数据重置
			<setCardDatas>: 设置手牌数据
			<getCardDatas>: 获取手牌数据
			<pushCardData>: 加入一张手牌
			<removeCardData>: 移除一张手牌
			<pushPengCard>: 加入一个碰的数据,用于获取是否有续杠
			<removePengCard>: 移除一个碰数据
			<getEatCardGroup>: 获取吃数据组合
			<getPengCardGroup>: 获取碰数据组合
			<getAnGangGroup>: 获取暗杠数据组合
			<getXuGang>: 获取选杠数据组合
			<getMGang>: 获取明杠数据组合

			<beganCheckHu>: 胡牌检测
		内部函数:
			<_splitCloneData>: 分解手牌转换成张数数组
			<_analysisCards>: 分析手牌
			<_specialCardStyleTingCheck>: 特殊牌型检测
			<_xiaoQiDui>: 检测是否是小七对和龙七对 听牌
			<_shiSanYao>: 检测是否是十三幺 听牌

4.【 OperateCompoment.js 】
	 des: 操作牌组件<碰、杠、吃>在手牌组件中的展示，里面包含类 OperationNode
	 方法：<OperationNode>
 		外部函数：
			<createOperatorNode>: 添加一个操作数据节点
			<changePengToGang>: 碰节点变杠节点 
			<getWidth>: 获取节点总宽
			<getHeight>: 获取节点总高
		内部函数:
			<_countTWidthAndTHeight>: 主要分析整图资源的总体宽高和个体宽高
			<_createOneMjCard>: 添加一个麻将牌
			<_setCardPoint>: 设置麻将牌位置
			<_isSortCardArr>: 部分玩家可能需要对数据排序<主要是吃数据顺序>
			<_chiNodeArray>: 吃节点 
			<_pengNodeArray>: 碰节点 
			<_mGangNodeArray>: 明杠节点 
			<_anGangNodeArray>: 暗杠节点 

		方法：<OperateCompoment>
 		外部函数：
			<reset>: 节点重置
			<createOneOperationNode>: 在组件中添加一个操作节点 
			<pushOperatorCard>: 加入一个操作节点的牌<记录所有的操作牌>
			<changeColorSelectedCard>: 更改牌值对应的操作牌颜色
			<getType>: 用户类型<上、下、左、右四家>
			<getOperatorNum>: 操作牌总数 

5.【 OtherCardCompoment.js 】
	OtherCardAray: array,用来除本家之外的其余家手牌<因为数组属性有时候会数据重叠,使用这种方式暂时解决>
	des: 手牌组件,除本家外
	 方法：
 		外部函数：
			<initCardNum>: 传入手牌张数,因为其余玩家手牌不需要展示具体数据
			<addShowOutCardObserver>:  展示出牌过程,这里做了出牌动画，对应执行出牌组件方法
			<removeAllCards>: 组件重置
			<setCardOpertatorPoint>: 设置挂载的操作牌组件初始坐标
			<lastCardIsNeedNullX>: 控制设置上牌最后一张需要特殊距离
			<uploadCard>: 上牌时组件变化
			<outPlayCard>: 出牌时组件变化
			<changeCardListSubCards>: 不论吃、碰、杠导致手牌变化都走这里
			<updateCardListPoint>: 组件牌数变化刷新
			<setCardOpertatorPoint>: 设置挂载的操作牌组件初始坐标
		内部函数:
			<_createMjCard>: 创建一张麻将牌
			<_getCardPositionByIdx>: 根据idx顺序获取在组件中的位置 
			<_initCards>: 初始化组件（传入牌数量initCardNum之后）
			<_isSortCardArr>: 部分玩家可能需要对数据排序<主要是吃数据顺序>
			<getComOperator>: 返回操作牌组件


6.【 OutCardsCodmpoment.js 】
	OutCardBeganPos: array,出牌组件的初始位置<因为数组属性有时候会数据重叠,使用这种方式暂时解决>
	OutCardOffect: array,牌距的一些细节调整<因为数组属性有时候会数据重叠,使用这种方式暂时解决>
	des: 出牌组件,所有玩家的出牌全部存储在这个组件节点上
	 方法：
 		外部函数：
			<showOutCard>: 显示一张出牌数据[data, type] type是玩家本地位置
			<setOutCardsData>:  出入出牌数据<一般用于重连对已经出的牌初始化>
			<reset>: 组件重置
			<removeOutCard>: 移除一张出牌,碰、杠、吃都会拿走这张牌
			<changeColorSelectedCard>: 更改牌数据等于当前选中牌的牌的颜色
			<uploadCard>: 上牌时组件变化
			<outPlayCard>: 出牌时组件变化
			<changeCardListSubCards>: 不论吃、碰、杠导致手牌变化都走这里
			<updateCardListPoint>: 组件牌数变化刷新
			<setCardOpertatorPoint>: 设置挂载的操作牌组件初始坐标
			<getOutCardsNum>: 返回当前对象
		内部函数:
			<_initOutCards>: 传入出牌数据后的初始化setOutCardsData
			<_createMjData>: 创建一张出牌麻将 
			<_addShowMyOutCard>: 添加显示一张本家位置的出牌麻将
			<_addShowLeftOutCard>: 添加显示一张上家位置的出牌麻将
			<_addShowRightOutCard>: 添加显示一张下家位置的出牌麻将
			<_addShowTopOutCard>: 添加显示一张对家位置的出牌麻将

