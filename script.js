// Callback for sign-in .OnClick.
function toggleSignIn() {
	if (!firebase.auth().currentUser) {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	} else {
		firebase.auth().signOut();
	}
}

// Callback for bar-toggle OnClick.
function toggleTopBar() {
	console.log("in toggle top bar");
	if (document.getElementById("sign-in").classList.contains("no-display")) {
		console.log("in toggle top bar - removing hidden");
		document.getElementById("sign-in").classList.remove("no-display");
		document.getElementById("title").classList.remove("no-display");
		document.getElementById("header").classList.remove("collapse");
		document.getElementById("bar-toggle").classList.remove("collapse");
	} else {
		console.log("in toggle top bar - adding hidden");
		document.getElementById("sign-in").classList.add("no-display");
		document.getElementById("title").classList.add("no-display");
		document.getElementById("header").classList.add("collapse");
		document.getElementById("bar-toggle").classList.add("collapse");
	}
}

// Function to get data for this user.
function getData() {
	return {
		nodes: {
			0:{x: 30, y:50, text:"The first node"},
			1:{x: 50, y:80, text:"The second node"},
			2:{x: 90, y:120, text:"The third node"},
		},
		links: [
			{source:0, target:1},
			{source:2, target:1},
		],
	}
}

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

// The main display function for nodes.
function displayData(nodes, links) {
	vis = d3.select("#content");

	circle = vis.selectAll("circle.node")
		.data(d3.entries(nodes), function(d){return d ? d.key : this.id;});
	circle.enter()
		.append("svg:circle")
		.attr("class", "node")
		.attr("cx", function(d) { return d.value.x; })
		.attr("cy", function(d) { return d.value.y; })
		.attr("r", "10px")
		.attr("fill", "black")
		.on("mouseover", showNodeDetails)
		.on("mouseout", hideNodeDetails);
	circle.exit().remove();

	links = vis.selectAll(".line")
		.data(links, function(d){ return d ? d.source + "_" + d.target : this.id;});
	links.enter()
		.append("line")
		.attr("x1", function(d) { return nodes[d.source].x; })
		.attr("y1", function(d) { return nodes[d.source].y; })
		.attr("x2", function(d) { return nodes[d.target].x; })
		.attr("y2", function(d) { return nodes[d.target].y; })
		.attr("stroke", "rgb(6, 120, 155");
	links.exit().remove();
}

// Initializes the app.
// Handles auth redirect.
// Sets up event handlers.
function initApp() {
	// Your web app's Firebase configuration
	var firebaseConfig = {
		apiKey: "AIzaSyDnIObGDE6KUuj76kbo5waqcsVCNzhcsR8",
		authDomain: "seybold-story-graph.firebaseapp.com",
		databaseURL: "https://seybold-story-graph.firebaseio.com",
		projectId: "seybold-story-graph",
		storageBucket: "seybold-story-graph.appspot.com",
		messagingSenderId: "737650996710",
		appId: "1:737650996710:web:26d80b6d1531d60b325227",
		measurementId: "G-S0KBGERZTV"
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	firebase.analytics();

	// Would need to listed to firebase.auth().getRedirectResult() to handle additional
	// requests and errors.

	// Listening for auth state changes.
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			document.getElementById('sign-in').textContent = user.email + ": sign out ";
			console.log(user);
		} else {
			document.getElementById('sign-in').textContent = "sign in";
		}
	});

	// Listeners for top bar click events.
	document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
	document.getElementById('bar-toggle').addEventListener('click', toggleTopBar, false);

	var data = getData();
	displayData(data.nodes, data.links);
}

window.onload = function() {
	initApp();
};
