//概览
/*
    SIZE:
    X:
    Y:
    W:
    H:
    addNodeTouchEventListener(node, listener_): 

    gl.create_2_array(num1, num2):
    gl.create_3_array(num1, num2, num3):
    gl.create_array_value: //创建并给数组赋值
    gl.create_2_array_value
    //action
    gl.scaleToOutAction(scale, time, callback):
    //
    gl.ZeroMemory(length):
    gl.CopyMemory(data, length):
    gl.CopyMemoryTs(tdata, began, data, length):
    //UI
    gl.createButton({normal, pressed, disabled, listener, touch_listener, target, tag}):创建按钮
    //cocos2d 计算
    gl.pAdd(pt1, pt2):
    gl.pSub(pt1, pt2):
    gl.pMul(pt1, factor):
    gl.pCross(self, factor):
    gl.pDot(self, other): 点积
    gl.pGetLength(pt):
    gl.pNormalize(pt):
    gl.pGetDistance(pt1, pt2):
    gl.pGetAngle(self, other):
    gl.pFroAngle(a):
    gl.pRotate(pt1, pt2):
    gl.pRotateByAngle(pt1, pt2, angle):
    gl.rectContainsPoint(rect, point):
    gl.rectIntersectsRect(rect1, rect2):

    //

*/

var dump = function(object) {
    //cc.log("{")
    var tstr = "{"
    for (var style in object) {
        var str = null;
        if (typeof(object[style]) == "function") {
            str = "\n\t" + style + ": " + "function" + ","
        } else if (typeof(object[style]) == "object") {
            var ctstr = "{"
            for (var cstyle in object[style]) {
                var cstr = null;
                if (typeof(object[style][cstyle]) == "function") {
                    cstr = "\n\t\t" + cstyle + ": " + "function" + ","
                } else {
                    cstr = "\n\t\t" + cstyle + ": " + object[style][cstyle] + ","
                }
                ctstr = ctstr + cstr;
            }
            ctstr = ctstr + "\n}";
            str = "\n\t" + style + "=" + ctstr;
        } else {
            str = "\n\t" + style + ": " + object[style] + ","
        }
        tstr = tstr + str;
    }
    tstr = tstr + "\n}";
    cc.log(tstr);
};

//都当成有contentsize的处理吧
SIZE = function(node){
    if (node == null) return null;
    var size = node.getContentSize();
    // if (size.width == 0 && size.height == 0){
    //     var size_ = node.getLayoutSize();
    //     return size_;
    // } else{
    //     return size;
    // }
    return size;
}
//获取坐标位置函数
X = function(node) {
    if (node == null)
        return null;
    return node.getPositionX();
}

Y = function(node) {
    if (node == null)
        return null;
    return node.getPositionY();
}

W = function(node) {
    if (node == null)
        return null;
    return SIZE(node).width;
}

H = function(node) {
    if (node == null)
        return null;
    return SIZE(node).height;
}

//
//拷贝一个类
//
gl.clone = function(p, c) {
    //cc.log("class_name: ", p.NAME);
    var c = c || {};  
    for (var i in p) {  
       
        if(!p.hasOwnProperty(i)){  
            //continue;  存在问题
        }  
        if (p.NAME == "CUserCardNew"){
            //cc.log("________________", i, p[i])
        }
        if (typeof p[i] === 'object') {  
            c[i] = (p[i].constructor === Array) ? [] : {};  
            gl.clone(p[i], c[i]);  
        } else {  
            c[i] = p[i];  
        }  
    }  
    return c;  
}

addNodeTouchEventListener = function(node, listener_){
    var listener = cc.EventListenerTouchOneByOne.create();
    listener.setSwallowTouches(true);
    var checkListener = function(touch, event){
        if (listener_ && typeof(listener_) == "function"){
            var location = touch.getLocation();
            event.x = location.x;
            event.y = location.y;
            event.location = location;
            event.node = node;
            var ret = listener_(touch, event);
            return ret;
        }
    }
    listener.onTouchBegan = function (touch, event){   
        event.name = "began";
        var ret = checkListener(touch, event);
        if (ret == null)
            ret = true;
        return ret;
    };
    listener.onTouchMoved = function (touch, event){   
        event.name = "moved";
        checkListener(touch, event);
    };
    listener.onTouchEnded = function (touch, event){   
        event.name = "ended";
        checkListener(touch, event);
    };
    cc.eventManager.addListener(listener, node);
    return listener;
}


////
//创建一个二维数组
gl.create_2_array = function(num1, num2)
{
    var tmp = [];
    for (var i = 0; i < num1; i ++){
        tmp[i] = new Array(num2);
    }
    return tmp;
}

gl.create_3_array = function(num1, num2, num3)
{
    var tmp = [];
    for (var i = 0; i < num1; i++){
        tmp[i] = new Array(num2);
        for (var j = 0; j < num2; j++){
            tmp[i][j] = new Array(num3);
        }
    }
    return tmp;
}

//给数组赋值
gl.create_array_value = function(length, value)
{
    var tmp = [];
    for (var i = 0; i < length; i++){
        tmp[i] = gl.clone(value);
    }
    return tmp;
}

gl.create_2_array_value = function(len1, len2, value)
{
    var tmp = [];
    for (var i = 0; i < len1; i++){
        tmp[i] = new Array(len2);
        for (var j = 0; j < len2; j++)
            tmp[i][j] = gl.clone(value);
    }
    return tmp;
}

////action
gl.scaleToOutAction = function(scale, time, callback)
{
    return cc.sequence(cc.scaleTo(scale, time), cc.callFunc(callback));
}

gl.ZeroMemory = function(length)
{
    var tmp = [];
    for (var i = 0; i < length; i++){
        tmp.push(0);
    }
    return tmp;
}

gl.CopyMemory = function(data, length)
{
    var tmp = [];
    if (length != null) {
        for (var i = 0; i < length; i++){
            tmp[i] = data[i];
        }
    } else {
        for (var k in data){
            tmp[k] = data[k];
        }
    }
    
    return tmp;
}

gl.CopyMemoryTs = function(tdata, began, data, length)
{
    var tmp = tdata;
    var idex = 0;
    for (var i = began; i < began + length; i++, idex++){
        tmp[i] = data[idex];
    }
    return tmp;
}

//______________________________UI_________________________
//{normal, pressed, disabled, listener, touch_listener, target, tag}
gl.createButton = function(params)
{
    var pressed = params.pressed || params.normal;
    var disabled = params.disabled || params.normal;
    var button = new ccui.Button(params.normal, pressed, disabled);
    button.setTag(params.tag ? params.tag: 0);
    if (params.listener)
        button.addClickEventListener(params.listener);
    if (params.touch_listener){
        var touchListener = function(sender, type){
            var event = {};
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    event.name = "began";
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    event.name = "moved";
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    event.name = "ended";
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    event.name = "cancle";
                    break;
                default:
                    break;
            }
            params.touch_listener(event);
        }
        button.addTouchEventListener(touchListener, params.target);
    }
    return button;
}


//-----------------------------------------------
gl.pAdd = function(pt1, pt2)
{
    return {x: pt1.x + pt2.x , y: pt1.y + pt2.y } 
}

gl.pSub = function(pt1, pt2)
{
    return {x: pt1.x - pt2.x , y: pt1.y - pt2.y }
}

gl.pMul = function(pt1, factor)
{
    return { x: pt1.x * factor , y: pt1.y * factor }
}

gl.pCross = function(self, other)
{
    return self.x * other.y - self.y * other.x;
}

gl.pDot = function(self, other)
{
    return self.x * other.x + self.y * other.y;
}

gl.pGetLength = function(pt)
{
    return Math.sqrt(pt.x * pt.x + pt.y * pt.y);
}

gl.pNormalize = function(pt)
{
    var length = gl.pGetLength(pt);
    if (0 == length)
        return {x: 1.0, y: 0.0};
    return {x: pt.x / length, y:pt.y / length};
}

gl.pGetDistance = function(pt1, pt2)
{
    var x = (pt2.x - pt1.x) * (pt2.x - pt1.x);
    var y = (pt2.y - pt1.y) * (pt2.y - pt1.y);
    return Math.sqrt(x + y);
}

gl.pGetAngle = function(self, other)
{
    var a2 = gl.pNormalize(self);
    var b2 = gl.pNormalize(other);
    var angle = Math.atan2(gl.pCross(a2, b2), cc.pDot(a2, b2));
    if(Math.abs(angle) < 1.192092896e-7) 
        return 0.0;
    return angle;
}

gl.pFroAngle = function(a)
{
    return {x: Math.cos(a), y: Math.sin(a)};
}

gl.pRotate = function(pt1, pt2)
{
    return { x: pt1.x * pt2.x - pt1.y * pt2.y, y: pt1.x * pt2.y + pt1.y * pt2.x }
}

gl.pRotateByAngle = function(pt1, pt2, angle)
{
    return gl.Add(pt2, gl.pRotate(gl.pSub(pt1, pt2), gl.pForAngle(angle)));
}

gl.rectContainsPoint = function( rect, point )
{
    var ret = false
    if (((point.x >= rect.x) && (point.x <= rect.x + rect.width)) &&
       ((point.y >= rect.y) && (point.y <= rect.y + rect.height))){
            ret = true
       }

    return ret
}

gl.rectIntersectsRect = function( rect1, rect2 )
{
   return !( rect1.x > rect2.x + rect2.width || rect1.x + rect1.width < rect2.x ||
                    rect1.y > rect2.y + rect2.height || rect1.y + rect1.height < rect2.y )
}

gl.min = function(a, b)
{
    return a < b ? a: b;
}

gl.max = function(a, b)
{
    return a > b ? a: b;
}

gl.unionWithRect = function(rect1, rect2)
{
    var thisLeftX = rect1.x;
    var thisRightX = rect1.x + rect1.width;
    var thisTopY = rect1.y + rect1.height;
    var thisBottomY = rect1.y; 

    if (thisRightX < thisLeftX)
    {
        // This rect has negative width
        var tmp = thisRightX;
        thisRightX = thisLeftX;
        thisLeftX = tmp; 
    }
    
    if (thisTopY < thisBottomY)
    {
        // This rect has negative height
        var tmp = thisTopY;
        thisTopY = thisBottomY;
        thisBottomY = tmp;
    }

    var otherLeftX = rect2.x;
    var otherRightX = rect2.x + rect2.width;
    var otherTopY = rect2.y + rect2.height;
    var otherBottomY = rect2.y;

    if (otherRightX < otherLeftX)
    {
        var tmp = otherRightX;
        otherRightX = otherLeftX;
        otherLeftX = tmp;
    }
    
    if (otherTopY < otherBottomY)
    {
        var tmp = otherTopY;
        otherTopY = otherBottomY;
        otherBottomY = tmp;
    }

    var combinedLeftX = gl.min(thisLeftX, otherLeftX);
    var combinedRightX = gl.max(thisRightX, otherRightX);
    var combinedTopY = gl.max(thisTopY, otherTopY);
    var combinedBottomY = gl.min(thisBottomY, otherBottomY);
    return cc.rect(combinedLeftX, combinedBottomY, combinedRightX - combinedLeftX, combinedTopY - combinedBottomY);
}