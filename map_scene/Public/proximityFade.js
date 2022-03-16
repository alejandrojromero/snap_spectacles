// -----JS CODE-----

//@input SceneObject camera
//@input SceneObject arrow
//@input SceneObject scripter
//@input SceneObject outline1
//@input SceneObject outline2

//@input Component.Image chevron1
//@input Component.Image chevron2
//@input Asset.Material mat

var event = script.createEvent("UpdateEvent");

event.bind(function (eventData)
{
    var posCamera = script.camera.getTransform().getWorldPosition();
    var posArrow = script.arrow.getTransform().getWorldPosition();
    var dist = posCamera.distance(posArrow);
    
    //var arrowMat = script.arrow.mainPass.baseColor;s
    //var alpha = (dist - 0)/(200 - dist);
    
    if(dist < 250){
      // script.chevron1.mainPass.baseColor = new vec4(1,1,1, alpha);
      //  print(script.chevron1.mainPass.baseColor);
      //global.tweenManager.startTween(script.scripter, "fade");
        script.chevron2.enabled = false;
        script.chevron1.enabled = false;
        script.outline1.enabled = false;
        script.outline2.enabled = false;
        
    } else{
        script.chevron2.enabled = true;
        script.chevron1.enabled = true;
        script.outline1.enabled = true;
        script.outline2.enabled = true;
        
       // script.chevron1.mainPass.baseColor = new vec4(1,1,1, dist * 0.01);
    }
    
    //print(dist);
   //print(script.mat.mainPass.baseColor)
    
    
});
