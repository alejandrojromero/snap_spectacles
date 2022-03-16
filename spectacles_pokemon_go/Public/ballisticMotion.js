// -----JS CODE-----


//@input SceneObject ball

var gravity = 9.8;
var pos = script.ball.getTransform().getWorldPosition()
var projectileImpulse;
var iniRelease = false;
var impulse = vec3.zero();
var lastPos;
var readyToProject = false;

function initialize() {
    script.createEvent("UpdateEvent").bind(onUpdate);
    lastPos = script.ball.getTransform().getWorldPosition();
}

initialize();



function onUpdate() {
        
    if (!readyToProject)
    return
    
        var dt = getDeltaTime();
        //print (dt)
        //dt = 1
        var accel = vecMulti(vec3.up(), -9.8);
        var curPos = script.ball.getTransform().getWorldPosition();
    
    
        if(iniRelease == false){
           var iniPos = curPos;
        }
        iniRelease = true;
    
        //curPos + (curPos - lastPos) + impulse * dt + accel * dt * dt   
        //var newPos = (curPos.add(curPos.sub(astPos))).add(vectorMultiFloat(impulse, dt)).add(vectorMultiFloat(vectorMultiFloat(accel, dt), dt));
        var newPos = curPos.add(curPos.sub(lastPos))
        newPos = newPos.add(vecMulti(impulse,dt))
        newPos = newPos.add(vecMulti(vecMulti(accel,dt), dt))
        print(newPos)

        
        //print("CUR: " + curPos + "LAST: " + lastPos + "NEW: "+ newPos)
        script.ball.getTransform().setWorldPosition(newPos);
        //script.ball.getTransform().setWorldPosition(newPos.sub(lastPos));
                //acceList.Add(newPos - curPos);
        lastPos = curPos;
       // print (newPos)
        impulse = vec3.zero();
    
        if(curPos.y < -100)
            readyToProject = false;
    
}

    script.api.addImpulse = function(handImpulse)
    {
        impulse = impulse.add(handImpulse)
    }

    script.api.ballReleased = function(){
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
