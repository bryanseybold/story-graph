function Story(doc, nodes = {}, links = []) {
	this.doc = doc;
	this.nodes = nodes;
	this.links = links;
	this.current_node = null;
	that = this
	
	svg = d3.select("#content");
	// One layer of indirection is needed because you want the zoom to apply to an interior group.
	vis = svg.append("g")
		.attr("id", "visualization");
	svg.call(d3.zoom()
		.scaleExtent([0.1, 1])
		.on("zoom", function () {
			vis.attr("transform", d3.event.transform)}));

	d3.select("#node_editor_submit")
		.on("click", (d, i) => {
			if (that.current_node != null) {
				that.nodes[that.current_node].text = d3.select("#node_editor_name").property("value");
				that.nodes[that.current_node].contents = d3.select("#node_editor_contents").property("value");
				console.log("saving:")
				console.log(that.nodes[that.current_node])
				d3.select("#editor").style("display", "none");
				d3.selectAll("circle.node").classed("selected_node", false);
			}
		})
	d3.select("#node_editor_close")
		.on("click", (d, i) => {
			d3.select("#editor").style("display", "none");
			d3.selectAll("circle.node").classed("selected_node", false);
		})
};

Story.prototype.saveGraph = function() {
	var graph = {
		nodes: this.nodes,
		links: this.links
	}
	var collection = firebase.firestore().collection('graphs').doc(this.doc).set(graph)
	.then(function() {console.log("saveGraph -- success!")})
	.catch(function(err) {console.log("saveGraph -- error: ", err)});
};

Story.prototype.loadGraph = function() {
	var that = this;
	var promise = firebase.firestore().collection('graphs').doc(this.doc).get()
	.then(function (doc) {
		var graph = doc.data();
		console.log("in load response: ", graph)
		that.nodes = graph.nodes;
		that.links = graph.links;
		that.render();
	})
	.catch(function(err) {console.log("loadGraph -- error: ", err)});
};

Story.prototype.render = function() {
	var that = this;
	vis = d3.select("#visualization");

	// Callback for ctrl+clicking on the background
	function ctrlClickBackground() {
		if (d3.event.ctrlKey || d3.event.metaKey) {
			// d3.mouse() gets the coordinates of the mouse in the visualization
			// coordinate frame. This is a critical transformation!
			var coords = d3.mouse(vis.node());
			var key = that.newNode(coords[0], coords[1]);
			that.setCurrentNode(key);
		}
	}
	d3.select("#content").on("click", ctrlClickBackground);

	// Callback for graph node mouseover.
	function showNodeDetails(d, i) {
		d3.select(this)
			.transition()
			.attr("fill", "orange")
			.attr("r", "20px");
		vis.append("text")
			.attr("id", "node_text_" + i)
			.attr("x", that.nodes[d.key].x + 10)
			.attr("y", that.nodes[d.key].y)
			.text(d.value.text);
	}
	// Callback for graph node mouseout.
	function hideNodeDetails(d, i) {
		d3.select(this)
			.transition()
			.attr("fill", "black")
			.attr("r", "10px");
		d3.select("#node_text_" + i).remove();
	}

	function dragstarted(d) {
		d3.select(this).attr("stroke", "black");
	}

	function dragged(d) {
		d3.select(this)
		  .raise()
		  .attr("cx", function(d) {
			  that.nodes[d.key].x = d3.event.x;
			  return that.nodes[d.key].x})
		  .attr("cy", function(d) {
			  that.nodes[d.key].y = d3.event.y;
			  return that.nodes[d.key].y})
		vis.selectAll(".line")
		  .filter(function (dl, di) {
			  return dl.source == d.key || dl.target == d.key;
		  })
   		  .attr("x1", function(dl) { return that.nodes[dl.source].x; })
		  .attr("y1", function(dl) { return that.nodes[dl.source].y; })
		  .attr("x2", function(dl) { return that.nodes[dl.target].x; })
		  .attr("y2", function(dl) { return that.nodes[dl.target].y; });
		vis.selectAll("#node_text_" + d.key)
		  .raise()
		  .attr("x", d3.event.x + 10)
		  .attr("y", d3.event.y)
	}

	function dragended(d) {
		d3.select(this).attr("stroke", null);
	}


	function clicked(d, i) {
		if (d3.event.defaultPrevented)
			return; // iff dragged
		old_node = that.current_node;
		if (d3.event.shiftKey) {
			that.links.push({source: old_node, target: d.key});
			that.render();
		}
		that.setCurrentNode(parseInt(d.key));
	}


	circle = vis.selectAll("circle.node")
		.data(d3.entries(that.nodes), function(d){return d ? d.key : this.id;});
	circle.enter()
		.append("svg:circle")
		.attr("class", "node")
		.attr("r", "10px")
		.attr("fill", "black")
		.attr("cx", function(d) { return d.value.x; })
		.attr("cy", function(d) { return d.value.y; })
		.on("mouseover", showNodeDetails)
		.on("mouseout", hideNodeDetails)
	        .on("click", clicked);

	
	circle.exit().remove();

	dragHandler = d3.drag()
	  	 .on("start", dragstarted)
		 .on("drag", dragged)
		 .on("end", dragended);
	dragHandler(vis.selectAll("circle.node"));

	links = vis.selectAll(".line")
		.data(that.links, function(d){ return d ? d.source + "_" + d.target : this.id;});
	links.enter()
		.append("line")
		.attr("x1", function(d) { return that.nodes[d.source].x; })
		.attr("y1", function(d) { return that.nodes[d.source].y; })
		.attr("x2", function(d) { return that.nodes[d.target].x; })
		.attr("y2", function(d) { return that.nodes[d.target].y; })
		.attr("class", "line")
		.attr("stroke", "rgb(6, 120, 155");
	links.exit().remove();
}

Story.prototype.updateNote = function(id, node_object) {
	this.nodes[id] = node_object;
}

Story.prototype.setCurrentNode = function(key) {
	d3.selectAll("circle.node")
		.classed("selected_node", false);
	d3.selectAll("circle.node")
		.filter(function (d, i) { return i === key; })
		.classed("selected_node", true);
	this.current_node = key;
	d3.select("#now_editing").text("Now editing node: " + this.nodes[this.current_node].text);
	d3.select("#node_editor_name").property("value", this.nodes[this.current_node].text);
	var contents = this.nodes[this.current_node].contents;
	contents = contents ? contents : ""
	d3.select("#node_editor_contents").property("value", contents);
	d3.select('#editor').style("display", "flex");
}

Story.prototype.newNode = function(x, y) {
	// Find the next integer key. This inefficiently
	// handles strings parsing, but it's probably good enough for this purpose.
	next_id = 0;
	while (next_id.toString() in this.nodes) {
		next_id = next_id + 1;
	}

	this.nodes[next_id] = {
		x: x,
 		y: y,
		text: "< unnamed node >",
		contents: "< empty >",
	};
	this.render();
	return next_id;
}

