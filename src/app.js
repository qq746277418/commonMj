var HelloWorldLayer = cc.Layer.extend({
    m_handCardComs: [],
    m_myHandCardCom: null,
    sprite:null,

    m_mjData: null,
    m_mjCardContorl: null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        this.m_mjData = new MjData();
        this.m_mjCardContorl = new MjControl();
        this.m_mjCardContorl.setCurrentSeat(-1);  //初始庄家位置

        for (var i = 0; i < MJ.GamePlayer; i++) {
            var cardM = null
            if (i == MJ.my_seat) {
                cardM = new MyCardCompoment(this);
                this.m_myHandCardCom = cardM;
                this.m_myHandCardCom.setInitCards(this.m_mjData.randGetCardDatas(13));
            } else {
                cardM = new OtherCardCompoment(this, i);
                var datas = this.m_mjData.randGetCardDatas(13);
                cardM.initCardNum(datas.length);
                cardM.getAI().initCardData(datas);
                cardM.getAI().addPlayOutObserver(this.onOutCard.bind(this));
            }
            this.m_handCardComs[i] = cardM;
            cardM.setPosition(MJ.IintHandPoint[i]);
            this.addChild(cardM);

            cardM.addShowOutCardObserver(this.showOutCard.bind(this))
        }

        this.m_outCardCom = new OutCardsCodmpoment();
        this.addChild(this.m_outCardCom);

        addNodeTouchEventListener(this, this._touchListener.bind(this));
        this._bindObserver();

        this.upLoadCard();
        return true;
    },

    _bindObserver: function()
    {
        this.m_myHandCardCom.serverSendOurCardObserver(this.onOutCard.bind(this));
        this.m_myHandCardCom.addOperateCardColorObserver(this.allOperatorCardsChangeColor.bind(this));
        this.m_myHandCardCom.addOutCardColorObserver(this.m_outCardCom.changeColorSelectedCard.bind(this.m_outCardCom));
        //this.m_myHandCardCom.addShowOutCardObserver(this.showOutCard.bind(this))
    },

    allOperatorCardsChangeColor: function(data, ret)
    {
        for (var i = 0; i < MJ.GamePlayer; i++){
            this.m_handCardComs[i].getComOperator().changeColorSelectedCard(data, ret);
        }
    },

    upLoadCard: function()
    {
        var currentSeat = this.m_mjCardContorl.nextSeat();
        this.m_handCardComs[currentSeat].uploadCard(this.m_mjData.randGetCardData());
    },

    onOutCard: function(card_data, seat)
    {
        this.m_handCardComs[seat].outPlayCard(card_data);
        this.upLoadCard();
    },

    showOutCard: function(card_data, seat)
    {
        return this.m_outCardCom.showOutCard(card_data, seat);
    },

    _touchListener: function(touch, event)
    {
        this.m_myHandCardCom.switchTouchPointToIndex(event);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

