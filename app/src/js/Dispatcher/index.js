
class DispatcherEvent {
	constructor(eventName){
		this.eventName = eventName
		this.callbacks = []
	}

	registerCallback(callback){
		this.callbacks.push(callback)
	}

	fire(data){
		this.callbacks.forEach((callback=>{
			callback(data)
		}))
	}
}

class Dispatcher {
	constructor(){
	  	this.events = {}
	}
 
	dispatch(eventName, data){
		const event = this.events[eventName]
		if(event){
			event.fire(data)
		}
	}
 
	//start listen event
	on(eventName, callback){
		let event = this.events[eventName]
		if(!event){
			event = new DispatcherEvent(eventName)
			this.events[eventName] = event
		}
		event.registerCallback(callback)
	}

	//stop listen event
	off(eventName, callback){
		const event = this.events[eventName]
		if(event){
			delete this.events[eventName]
		}
	}
}

export default Dispatcher;