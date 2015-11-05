chrome.tabs.onCreated.addListener(function(tab){
	var rootPage;
	var rootRoot;
	var rootId = tab.id;
	console.log(tab);
	chrome.storage.local.get(["id", "rootPage", "rootRoot", "stat"], function(items){

		if(items.stat == "pause"){
			return;
		}

		if(items.rootRoot){
			rootRoot = JSON.parse(items.rootRoot);
		}
		else {
			rootRoot = {};
		}

		if(items.rootPage){
			rootPage = JSON.parse(items.rootPage);
		}
		else {
			rootPage = {};
		}

		if(tab.url == "chrome://newtab/"){
			console.log("new tab");
			rootRoot[rootId.toString()] = null;
		}
		else {
			console.log("old tab");
			rootRoot[rootId.toString()] = tab.openerTabId;
			console.log(tab);
			console.log(rootRoot);
		}
	
		rootPage[rootId.toString()] = null;

		chrome.storage.local.set({"rootRoot": JSON.stringify(rootRoot)});
		chrome.storage.local.set({"rootPage": JSON.stringify(rootPage)});
	});
	
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(changeInfo.status == "complete" && tab.url != tab.title){
		var id;
		var rootPage;
		var rootRoot;
		var pagePage;
		var rootId = tab.id;
		var pages;

		chrome.storage.local.get(["id", "rootPage", "rootRoot", "pages", "pagePage", "stat"], function(items){

			if(items.stat == "pause"){
				return;
			}

			if(items.id){
				id = items.id + 1;
			}
			else {
				id = 1;
			}
			chrome.storage.local.set({"id": id});

			if(items.rootRoot){
				rootRoot = JSON.parse(items.rootRoot);
			}
			else {
				rootRoot = {};
			}

			if(items.rootPage){
				rootPage = JSON.parse(items.rootPage);
			}
			else {
				rootPage = {};
			}

			if(items.pagePage){
				pagePage = JSON.parse(items.pagePage);
			}
			else {
				pagePage = {};
			}

			var rootPageOrigin = rootPage[rootId.toString()];
			if(rootPageOrigin){
				pagePage[id.toString()] = rootPage[rootId.toString()];
			}
			else if(rootRoot[rootId.toString()]){
				pagePage[id.toString()] = rootPage[rootRoot[rootId.toString()].toString()];
			}
			else {
				pagePage[id.toString()] = null;
			}

			chrome.storage.local.set({"pagePage": JSON.stringify(pagePage)});

			rootPage[rootId.toString()] = id;

			chrome.storage.local.set({"rootPage": JSON.stringify(rootPage)});

			var name;
			
			if(tab.title.length > 20){
				name = tab.title.substring(0, 20);
			}
			else {
				name = tab.title;
			}

			if(tab.active){
				chrome.tabs.captureVisibleTab(tab.windowId, {format: "jpeg", quality: 10}, function(dataUrl){
					newPage = {
						id: id,
						rootId: rootId,
						title: tab.title,
						name: name,
						url: tab.url,
						screenshot: dataUrl,
						startTime: new Date().getTime()
					}

					if(items.pages){
						pages = JSON.parse(items.pages);
					}
					else {
						pages = {}
					}

					pages[id.toString()] = newPage;
					chrome.storage.local.set({"pages": JSON.stringify(pages)});
				});
			} else {
				newPage = {
						id: id,
						rootId: rootId,
						title: tab.title,
						name: name,
						url: tab.url,
						screenshot: "",
						startTime: new Date().getTime()
					}

				if(items.pages){
					pages = JSON.parse(items.pages);
				}
				else {
					pages = {}
				}

				pages[id.toString()] = newPage;
				chrome.storage.local.set({"pages": JSON.stringify(pages)});
			}

		});
	}
});

chrome.tabs.onActivated.addListener(function(activeInfo){
	chrome.storage.local.get(["pages", "rootPage"], function(items){
		if(items.pages){
			var rootPage = JSON.parse(items.rootPage);
			var pages = JSON.parse(items.pages);
			var pageId;
			if(rootPage[activeInfo.tabId.toString()]){
				pageId = rootPage[activeInfo.tabId.toString()].toString();
			} else {
				return;
			}

			if(pages[pageId] != null && pages[pageId].screenshot == ""){
				chrome.tabs.captureVisibleTab(activeInfo.windowId, null, function (dataUrl){
					pages[pageId].screenshot = dataUrl;
					chrome.storage.local.set({"pages": JSON.stringify(pages)});
				});
			}
		}
	});
});
