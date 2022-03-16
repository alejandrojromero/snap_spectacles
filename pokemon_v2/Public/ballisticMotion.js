// -----JS CODE-----


//@input SceneObject ball
//@input SceneObject ball2
//@input SceneObject pokemon
//@input SceneObject pokemonMesh
//@input SceneObject effects
//@input SceneObject circle
//@input SceneObject finalText
//@input Component.ScriptComponent IdleAnimation

//@input SceneObject pikachu
//@input SceneObject bulbasaur
//@input SceneObject eevee
//@input SceneObject sandshrew

var gravity = -490;
var pos = script.ball.getTransform().getWorldPosition()
var projectileImpulse;
var iniRelease = false;
var impulse = vec3.zero();
var lastPos;
var readyToProject = false;
var iniPos = vec3.zero()

var delayedEvent = script.createEvent("DelayedCallbackEvent");
var pokemonArray = [script.pikachu, script.bulbasaur, script.eevee, script.sandshrew];


//var curPos = vec3.zero()
function initialize() {
    script.createEvent("UpdateEvent").bind(onUpdate);
    lastPos = script.ball.getTransform().getWorldPosition();
    
    var index = ranNum(pokemonArray.length)
    pokemonArray[index].enabled = true;
}

initialize();



function onUpdate() {
            
    
    if (!readyToProject)
        return
        var dt = getDeltaTime();
        //print (dt)
        //dt = 1
        var accel = vecMulti(vec3.up(), gravity);
        //var curPos = script.ball.getTransform().getWorldPosition();
    
    
        if(iniRelease == false){
          var curPos = iniPos
          lastPos = iniPos
          iniRelease = true;
        } else {
        
         var curPos = script.ball.getTransform().getWorldPosition();        
        }
    

    
        //curPos + (curPos - lastPos) + impulse * dt + accel * dt * dt   
        //var newPos = (curPos.add(curPos.sub(astPos))).add(vectorMultiFloat(impulse, dt)).add(vectorMultiFloat(vectorMultiFloat(accel, dt), dt));
        var newPos = curPos.add(curPos.sub(lastPos))
        newPos = newPos.add(vecMulti(impulse,dt))
        newPos = newPos.add(vecMulti(vecMulti(accel,dt), dt))
        //print(newPos)

        
        //print("CUR: " + curPos + "LAST: " + lastPos + "NEW: "+ newPos)
        script.ball.getTransform().setWorldPosition(newPos);
        //script.ball.getTransform().setWorldPosition(newPos.sub(lastPos));
                //acceList.Add(newPos - curPos);
        lastPos = curPos;
       // print (newPos)
        impulse = vec3.zero();
    
        if(curPos.y < -100 || Math.abs(curPos.z) > 1000){
            readyToProject = false;
            print ("reset condition met!" + curPos)
        }
    
    
      print("DISTANCE:" + script.ball.getTransform().getWorldPosition().distance(script.pokemon.getTransform().getWorldPosition()))
    if(script.ball.getTransform().getWorldPosition().distance(script.pokemon.getTransform().getWorldPosition()) <= 100){
        script.finalText.enabled = true;
        global.behaviorSystem.sendCustomTrigger("collision");
        script.ball.enabled = false;
        script.effects.enabled = true;
        script.IdleAnimation.enabled = false;
        script.pokemon.enabled = false;
        
        //Destroy pokemon ater animation delay
        delayedEvent.reset(3);
        
    }
    
        
    
}

script.api.reset = function(){ 
    lastPos = vec3.zero()
    iniRelease = false;
    print("running")
}

script.api.addImpulse = function(handImpulse)
    {
        impulse = impulse.add(handImpulse)
    }

script.api.ballReleased = function(_inipos){
        iniPos = _inipos
        readyToProject = true;              
}


function vecMulti(v, f){
    return new vec3((v.x * f), (v.y * f), (v.z * f))
}

function vectorAddFloat(v, f){
    return new vec3((v.x + f), (v.y + f), (v.z + f))
}

function vecDivide(v, f){
    return new vec3((v.x / f), (v.y / f), v.z / f)
}


delayedEvent.bind(function(eventData)
{
    print("DONE DONE DONE")
    script.pokemon.enabled = false;
    script.ball2.enabled = false;
});

function ranNum(num){
    return Math.floor(Math.random() * num);
}
