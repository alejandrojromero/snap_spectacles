// SingleGestureTrigger.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Send triggers if a hand gesture is detected

/*
Check out SequencedGestureTrigger.js to send out triggers when a single gesture is detected
*/


//@input int handType = 0 {"widget":"combobox","values":[{"value":"0","label":"Any"},{"value":"1","label":"Left"},{"value":"2","label":"Right"}]}
//@input Component.Text hintText
//@input string noGestureHint
//@input string gestureName
//@input bool logMessage
//@input SceneObject WristR
//@input SceneObject ball
//@input SceneObject mainTrackingObj
//@input SceneObject pinky

//@input Component.ScriptComponent motion



var handClosed = false;
var released = false;
var iniRelease = false;
var iniPos;
var grabbed = false;


var handPosQueue = []

var gestureDetected = script.gestureName + "_Detected";
//gestureDetected will trigger when this gesture is detected
var gestureLost = script.gestureName + "_Lost";
//gestureLost will trigger when this gesture is lost


const HAND_TYPE = {
    ANY: 0,
    LEFT: 1,
    RIGHT: 2
};

var checkLength;

//use the following to get average position of joints (see later in script)
//var getJointsAveragePosition;
var getDistance;
var isHandTracking;

var previousGestureDetected = false;
var currentGestureDetected = false;

var toleranceTimer = 0;
var toleranceTimeMax = 0.2;

var handString;

function initialize() {

    setUpTracking();
    
    if (!script.hintText) {
        print("HINT! Add text component to Hint Text on " + script.getSceneObject().name);
    }    
    script.createEvent("UpdateEvent").bind(onUpdate);
}


initialize();


function onUpdate() {
    
    var pos = script.WristR.getTransform().getWorldPosition();
    var rot = script.WristR.getTransform().getWorldRotation();
    var ballPos = script.ball.getTransform().getWorldPosition();
    
    //print (script.pinky.getTransform().getWorldPosition());
    
    if(handPosQueue.length == 20){
        handPosQueue.shift()
    }
    handPosQueue.push(pos)
    
    
    /*print("DISTANCE: " + pos.distance(ballPos))
    print("HANDGESTURE: " + getGesture())
    print("GRABBED?: " + grabbed)
    print("POS?: " + ballPos)*/
    
  //  if(pos.distance(ballPos) >= 500){
    //    released = false;
     //   grabbed = false;
        //script.ball.destroy();
      
        
    //}
    
   // logMessage(handPosQueue)
    //logMessage("LENGTH:" + handPosQueue.length)
    
    
    
    
    //logMessage("posR:" + script.WristR.getTransform().getWorldPosition());
    getTracking();
    
    //distance
    //print(script.pinky.getTransform().getWorldPosition().distance(script.WristR.getTransform().getWorldPosition()))

    if (!isHandTracking) {
        updateText();
        if (currentGestureDetected) {
            sendBehaviorTriggers(gestureLost);
            currentGestureDetected = false;
            previousGestureDetected = currentGestureDetected;
        }
        return;
    }
    
    script.ball.getTransform().setWorldPosition(pos)
    
    if(isGrabbingGesture()){
        grabbed = true;
    
        print ("grabbed!");
    //    script.ball.getTransform().setWorldPosition(pos)
     //   script.ball.getTransform().setWorldRotation(rot)
    }
    
    if(!isGrabbingGesture() && grabbed){
            released = true;
    } 
    
    
    if(released == true){
        print("EXECUTE?")
        script.ball.getTransform().setWorldPosition(pos)
        released = false;
        grabbed = false;
        return;        
        var average_impulse = getAverageImpulse(handPosQueue);        
        
        script.motion.api.ballReleased()
        script.motion.api.addImpulse(average_impulse);
        
        print (average_impulse)
        //script.ball.destroy();
        
        // Send a global Custom Trigger that any BehaviorScript can react to
       // global.behaviorSystem.sendCustomTrigger("release_ball");
        
       // logMessage("RELEASED BALL")

        //handClosed = true;
        //script.ball.setParentPreserveWorldTransform(script.mainTrackingObj)

    }
    
    
    /*
    currentGestureDetected = isGrabbingGesture();
    
    if (previousGestureDetected != currentGestureDetected) {

        if (toleranceTimer < toleranceTimeMax) {
            toleranceTimer += getDeltaTime();
        } else {

            if (currentGestureDetected) {
                updateText(gestureDetected);
                sendBehaviorTriggers(gestureDetected);
            } else {
                updateText(gestureLost);
                sendBehaviorTriggers(gestureLost);
            }

            toleranceTimer = 0;
            previousGestureDetected = currentGestureDetected;
        }
        
    }
    */

}


//var throwBall = script.createEvent("UpdateEvent");
//
//
//throwBall.bind(function (eventData)
//{
//     
//    onFrameUpdate = function(eventData) {
//    
//    if(eventData.getDeltaTime() == 10){
//            script.ball.destroy();
//}
//
//    }
//});

/* check if the hand is close */
function isGrabbingGesture() {
    
    /*returns true if distance between
    thumb tip and mid tip
    thumb tip and index tip
    are smaller than 5
    if so then we'll consider the GRAB action is detected
    other fingers are free to do whatever they like unless defined
    */
    return checkLength([getDistance("thumb-3","mid-3"), getDistance("thumb-3","index-3")], 0, 7);
    
/*    
    //the following condition provides an 'OK' hand gesture
    //try replacing the conditions in the if() statement with your own
    //to create your own custom gesture!
    if(checkLength(getDistance("index-3","thumb-3"), 0, 3)
    && checkLength([getDistance("mid-3","wrist"),getDistance("ring-3","wrist"),getDistance("pinky-3","wrist")], 12, 100)){
        return true;
    }else{
        return false;
    }
*/
}

function updateText(txt) {
    if (script.hintText) {
        script.hintText.text = isHandTracking ? (handString + txt) : script.noGestureHint;
    }
}

function setUpTracking() {
    var hand = null;

    switch (script.handType) {
        case HAND_TYPE.ANY:
            checkLength = global.checkLength;
            getDistance = global.getJointsDistance;
            //getJointsAveragePosition = global.getJointsAveragePosition;
            break;
        case HAND_TYPE.LEFT:
            hand = global.leftHand();
            break;
        case HAND_TYPE.RIGHT:
            hand = global.rightHand();
            break;
    }

    
    
    if (hand) {
       
        checkLength = hand.api.checkLength;
        getDistance = hand.api.getJointsDistance;
        //getJointsAveragePosition = hand.api.getJointsAveragePosition;
    }
}

function getTracking() {
    switch (script.handType) {
        case HAND_TYPE.ANY:
            isHandTracking = (global.getActiveHandController() == null) ? false : true ;
            handString = global.getHand() + ": ";
            break;
        case HAND_TYPE.LEFT:
            if (global.leftHand() && global.leftHand().api.isTracking) {
                isHandTracking = global.leftHand().api.isTracking();
                handString = "L: ";
            }
            break;
        case HAND_TYPE.RIGHT:
            if (global.rightHand() && global.rightHand().api.isTracking) {
                isHandTracking = global.rightHand().api.isTracking();
                handString = "R: ";
            }
            break;
    }
}

function sendBehaviorTriggers(triggerString) {
    //logMessage("posR:" + script.WristR.getTransform().getWorldPosition());
    //logMessage("posL:" + global.leftHand().getTransform().getWorldPosition());
   
    
    
    
    //logMessage(triggerString);
    global.behaviorSystem.sendCustomTrigger(triggerString);
}

function logMessage(message) {
    if (script.logMessage) {
        print(message);
    }
}


function getAverageImpulse(handPos){
    var impulse = vec3.zero();
    
    if(handPos.length > 1){
            for (var i = 1; i < handPos.length; i++){
        //    print("First Hand pos: " + handPos[i])
     ///       print("WTF: " + handPos[i - 1])
            impulse = impulse.add(handPos[i].sub(handPos[i - 1]))
        }
    }

   
   // print("VECTOR FIRST ELEMENT: " + impulse)

    return impulse;
    
}


function vectorAddFloat(v, f){
    return new vec3((v.x + f), (v.y + f), (v.z + f))
}



//function addImpulse(){
    

    
//    var dt = getDeltaTime();
//    var accel = -9.8 * vec3.up();
//    
//    
//    var curPos = script.ball.getTransform().getWorldPosition();
//    
//    if(iniRelease == false){
//         var iniPos = curPos;
//    }
//    iniRelease = true;
//
//    
//    var newPos = curPos + (curPos - lastPos) + impulse * dt + accel * dt * dt;
//    
    
    

    
    
//        // Degrees to rotate by
//    var degrees = 90 * getDeltaTime();
//
//    // Convert degrees to radians
//    var radians = degrees * (Math.PI / 180);
//
//    // Axis to rotate around
//    var axis = vec3.up();
//
//    // Rotation we will apply to the object's current rotation
//    var rotationToApply = quat.angleAxis(radians, axis);
//
//    // Get the object's current world rotation
//    var oldRotation = script.ball.getTransform().getWorldRotation();
//
//    // Get the new rotation by rotating the old rotation by rotationToApply
//    var newRotation = rotationToApply.multiply(oldRotation);
//    
//    // Get the new rotation by rotating the old rotation by rotationToApply
//   // var newVelocity = 
//    
//    var oldPosition = script.ball.getTransform().getWorldPosition()
    
    
   // var newPosition = newVelocity.multiply(script.ball.getTransform().getWorldPosition)
   //  logMessage(newPosition)

    // Set the object's world rotation to the new rotation
    //script.ball.getTransform().setWorldRotation(newRotation); 
    
    // Set the object's world postion to the new position
    //script.ball.getTransform().setWorldPosition(oldPosition + vec3.forward() * eventData.getDeltaTime());
//}