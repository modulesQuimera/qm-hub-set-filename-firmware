module.exports = function(RED) {

	function set_filename_firmwareNode(config) {
		RED.nodes.createNode(this,config);
		this.compare_select = config.compare_select;
		this.filename = config.filename;
		this.boundrate = config.boundrate;
		var node = this;
		
		node.on('input', function(msg) {
			var _compare = {};
			var globalContext = node.context().global;
			var currentMode = globalContext.get("currentMode");
			var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            
            var command

			if (node.compare_select == "lora"){
                command = {
                    type: "processing_modular_V1_0",
                    slot: 1,
                    method: "lora_recorder",
                    compare: { status: { "==" : true}},
                    filename: node.filename,
                    boundrate: parseInt(node.boundrate)
                }
            }else {
                command = {
                    type: "processing_modular_V1_0",
                    slot: 1,
                    method: "stm_recorder",
                    compare: { status: { "==" : true}},
                    filename: node.filename,
                }
            }
			
			
			if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                }
            }
			globalContext.set("exportFile", file);
			console.log(command)
			node.send(msg);
		});
	}
	RED.nodes.registerType("set_filename_firmware", set_filename_firmwareNode);
}