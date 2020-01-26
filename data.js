function Story(doc, nodes = {}, links = []) {
	this.doc = doc;
	this.nodes = nodes;
	this.links = links;
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
	vis = d3.select("#content");

	// Callback for graph node mouseover.
	function showNodeDetails(d, i) {
		d3.select(this)
			.transition()
			.attr("fill", "orange")
			.attr("r", "20px");
		vis = d3.select("#content");
		vis.append("text")
			.attr("id", "node_text_" + i)
			.attr("x", d.value.x + 10)
			.attr("y", d.value.y)
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
		  .attr("cx", d.value.x = d3.event.x)
		  .attr("cy", d.value.y = d3.event.y);
		vis.selectAll(".line")
		  .filter(function (dl, di) {
			  return dl.source == d.key || dl.target == d.key;
		  })
   		  .attr("x1", function(dl) { return that.nodes[dl.source].x; })
		  .attr("y1", function(dl) { return that.nodes[dl.source].y; })
		  .attr("x2", function(dl) { return that.nodes[dl.target].x; })
		  .attr("y2", function(dl) { return that.nodes[dl.target].y; });

	}

	function dragended(d) {
		d3.select(this).attr("stroke", null);
	}


	function clicked(d, i) {
		if (d3.event.defaultPrevented)
			return; // iff dragged
	}


	circle = vis.selectAll("circle.node")
		.data(d3.entries(that.nodes), function(d){return d ? d.key : this.id;});
	circle.enter()
		.append("svg:circle")
		.attr("class", "node")
		.attr("cx", function(d) { return d.value.x; })
		.attr("cy", function(d) { return d.value.y; })
		.attr("r", "10px")
		.attr("fill", "black")
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
		.attr("class", "line")
		.attr("x1", function(d) { return that.nodes[d.source].x; })
		.attr("y1", function(d) { return that.nodes[d.source].y; })
		.attr("x2", function(d) { return that.nodes[d.target].x; })
		.attr("y2", function(d) { return that.nodes[d.target].y; })
		.attr("stroke", "rgb(6, 120, 155");
	links.exit().remove();
}
