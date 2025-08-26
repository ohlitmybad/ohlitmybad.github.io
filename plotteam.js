let initializeCustomSelectors = function() {
            // League selector functionality
            const leagueTrigger = document.getElementById('league-select-trigger');
            const leagueOptions = document.getElementById('league-select-options');
            const leagueSelect = document.getElementById('select-league');
            
            setupCustomSelect(leagueTrigger, leagueOptions, leagueSelect);
            
            // X metric selector functionality
            const xTrigger = document.getElementById('x-metric-trigger');
            const xOptions = document.getElementById('x-metric-options');
            const xSelect = document.getElementById('select-x');
            
            // Populate X metric options
            populateMetricOptions(xOptions, header.slice(3), function(option, value) {
                if (xTrigger.querySelector('span').textContent === value) {
                    option.classList.add('selected');
                }
                if (value === header[3]) { // Default value
                    option.classList.add('selected');
                    // Update trigger text
                    xTrigger.querySelector('span').textContent = value;
                    const metricKey = value.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
                    xTrigger.querySelector('span').setAttribute('data-i18n', 'metrics.' + metricKey);
                }
            });
            
            setupCustomSelect(xTrigger, xOptions, xSelect);
            
            // Y metric selector functionality
            const yTrigger = document.getElementById('y-metric-trigger');
            const yOptions = document.getElementById('y-metric-options');
            const ySelect = document.getElementById('select-y');
            
            // Populate Y metric options
            populateMetricOptions(yOptions, header.slice(3), function(option, value) {
                if (yTrigger.querySelector('span').textContent === value) {
                    option.classList.add('selected');
                }
                if (value === header[4]) { // Default value
                    option.classList.add('selected');
                    // Update trigger text
                    yTrigger.querySelector('span').textContent = value;
                    const metricKey = value.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
                    yTrigger.querySelector('span').setAttribute('data-i18n', 'metrics.' + metricKey);
                }
            });
            
            setupCustomSelect(yTrigger, yOptions, ySelect);
        };
        
        // Function to populate metric options
        function populateMetricOptions(optionsContainer, metrics, callback) {
            // Clear existing options
            optionsContainer.innerHTML = '';
            
            // Create a custom option for each metric
            metrics.forEach(function(metric) {
                const customOption = document.createElement('div');
                customOption.className = 'metric-select-option';
                customOption.setAttribute('data-value', metric);
                
                const span = document.createElement('span');
                span.textContent = metric;
                
                // Add data-i18n attribute for translation
                const metricKey = metric.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
                span.setAttribute('data-i18n', 'metrics.' + metricKey);
                
                customOption.appendChild(span);
                
                // Call the callback to potentially add selected class
                if (callback) callback(customOption, metric);
                
                optionsContainer.appendChild(customOption);
            });
        }
        
        // Function to set up a custom select
        function setupCustomSelect(trigger, options, selectElement) {
            // Toggle dropdown when clicking the trigger
            trigger.addEventListener('click', function() {
                // Close all other open dropdowns first
                document.querySelectorAll('.custom-select-trigger.open, .metric-select-trigger.open').forEach(function(openTrigger) {
                    if (openTrigger !== trigger) {
                        openTrigger.classList.remove('open');
                        const openOptions = openTrigger.nextElementSibling;
                        if (openOptions) openOptions.style.display = 'none';
                    }
                });
                
                // Toggle this dropdown
                trigger.classList.toggle('open');
                const isOpen = trigger.classList.contains('open');
                options.style.display = isOpen ? 'block' : 'none';
            });
            
            // Handle option selection
            const optionElements = options.querySelectorAll('.custom-select-option, .metric-select-option');
            optionElements.forEach(option => {
                option.addEventListener('click', function() {
                    // Update selected option
                    optionElements.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Update trigger content
                    const text = this.querySelector('span').textContent;
                    const dataI18n = this.querySelector('span').getAttribute('data-i18n');
                    const icon = this.querySelector('iconify-icon');
                    
                    trigger.innerHTML = '';
                    
                    if (icon) {
                        const clonedIcon = icon.cloneNode(true);
                        clonedIcon.style.marginRight = '8px';
                        trigger.appendChild(clonedIcon);
                    }
                    
                    const span = document.createElement('span');
                    span.textContent = text;
                    if (dataI18n) {
                        span.setAttribute('data-i18n', dataI18n);
                    }
                    trigger.appendChild(span);
                    
                    // Update hidden select and trigger change event
                    const value = this.getAttribute('data-value');
                    selectElement.value = value || text;
                    
                    // Trigger the change event on the hidden select
                    const event = new Event('change');
                    selectElement.dispatchEvent(event);
                    
                    // Close dropdown
                    trigger.classList.remove('open');
                    options.style.display = 'none';
                });
            });
            
            // Add keyboard navigation
            let searchTerm = '';
            let searchTimeout;
            
            // Add keydown event listener to the document
            document.addEventListener('keydown', function(e) {
                // Only process keyboard input when dropdown is open
                if (!trigger.classList.contains('open')) return;
                
                // Handle arrow keys for navigation
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    
                    const visibleOptions = Array.from(optionElements);
                    const currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('selected'));
                    let newIndex;
                    
                    if (e.key === 'ArrowDown') {
                        newIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
                    } else {
                        newIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
                    }
                    
                    // Update selection
                    optionElements.forEach(opt => opt.classList.remove('selected'));
                    visibleOptions[newIndex].classList.add('selected');
                    
                    // Ensure the selected option is visible in the dropdown
                    visibleOptions[newIndex].scrollIntoView({ block: 'nearest' });
                    
                    return;
                }
                
                // Handle Enter key to select the currently highlighted option
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const selectedOption = options.querySelector('.selected');
                    if (selectedOption) {
                        selectedOption.click();
                    }
                    return;
                }
                
                // Handle Escape key to close the dropdown
                if (e.key === 'Escape') {
                    e.preventDefault();
                    trigger.classList.remove('open');
                    options.style.display = 'none';
                    return;
                }
                
                // Handle typing to search
                if (e.key.length === 1 && e.key.match(/[a-zA-Z0-9%]/)) {
                    // Clear the previous timeout
                    clearTimeout(searchTimeout);
                    
                    // Add the key to the search term
                    searchTerm += e.key.toLowerCase();
                    
                    // Find the first option that starts with the search term
                    const matchingOption = Array.from(optionElements).find(option => {
                        const optionText = option.querySelector('span').textContent.toLowerCase();
                        return optionText.startsWith(searchTerm);
                    });
                    
                    // If a matching option is found, select it
                    if (matchingOption) {
                        optionElements.forEach(opt => opt.classList.remove('selected'));
                        matchingOption.classList.add('selected');
                        matchingOption.scrollIntoView({ block: 'nearest' });
                    }
                    
                    // Clear the search term after a delay
                    searchTimeout = setTimeout(() => {
                        searchTerm = '';
                    }, 1000);
                }
            });
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            const triggers = document.querySelectorAll('.custom-select-trigger, .metric-select-trigger');
            const optionsContainers = document.querySelectorAll('.custom-select-options, .metric-select-options');
            
            let clickedInsideDropdown = false;
            
            triggers.forEach(function(trigger, index) {
                const options = optionsContainers[index];
                
                if (trigger && options && (trigger.contains(e.target) || options.contains(e.target))) {
                    clickedInsideDropdown = true;
                }
            });
            
            if (!clickedInsideDropdown) {
                triggers.forEach(function(trigger, index) {
                    if (trigger && optionsContainers[index]) {
                        trigger.classList.remove('open');
                        optionsContainers[index].style.display = 'none';
                    }
                });
            }
        });



   
        // Load the data
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://datamb.football/database/TEAM/teamplots.csv', false);
        xhr.send(null);
        
        let csvData = xhr.responseText;
        
        let extraHeaderRow = 'ID,Player,Top 7 Leagues,Goals per 90,xG per 90,Shots on target per 90,Shots on target %,Passes completed,Pass accuracy %,Possession %,Positional attacks per 90,Counter attacks per 90,Touches in the box per 90,Goals conceded per 90,SoT against per 90,Defensive duels per 90,Defensive duel %,Aerial duels per 90,Aerial duels %,Passes per possession,PPDA\n';
        
        // Concatenate the extra header row with the fetched CSV data
        csvData = extraHeaderRow + csvData;
        
        var rows = csvData.trim().split('\n');
        var header = rows[0].split(',');
        var data = rows.slice(1).map(function(row) {
            return row.split(',').map(function(d, i) {
                if (i >= 3) {
                    return parseFloat(d);
                } else {
                    return d;
                }
            });
        });
        
        var margin = { top: 0, right: 0, bottom: 0, left: 0 };
        var width = 1082 - margin.left - margin.right;
        var height = 770 - margin.top - margin.bottom;
        
        // Define league colors for clicked circles
        var leagueColors = {
            "Premier League": "rgb(255, 0, 0, 0.7)",         // 1
            "La Liga": "rgb(255, 223, 0, 0.7)",             // 2
            "Bundesliga": "rgb(85, 209, 73, 0.7)",          // 3
            "Serie A": "rgb(0, 191, 255, 0.7)",             // 4
            "Ligue 1": "rgb(153, 50, 204, 0.7)",            // 5
            "Eredivisie": "rgb(255, 140, 0, 0.7)",          // 6
            "Primeira Liga": "rgb(255, 20, 147, 0.7)"
        };

        // Function to get color based on league
        function getLeagueColor(league) {
            return leagueColors[league] || "rgba(255, 0, 0, 0.7)"; // Default to red if league not found
        }
        
        // Calculate container width to center the chart
        function updateChartDimensions() {
            var containerWidth = document.querySelector('.chart-wrapper').clientWidth;
            var containerHeight = window.innerHeight * 0.7; // Use 70% of viewport height as max height
            
            // Set consistent side margins regardless of screen size
            var sideMargin = 30; // Consistent side margin in pixels
            var svgWidth = Math.min(1082, containerWidth - (sideMargin * 2));
            
            // Detect if we're on a vertical screen (mobile)
            var isVerticalScreen = window.innerWidth / window.innerHeight < 1;
            
            // Set consistent margins that work for both orientations
            if (isVerticalScreen) {
                // Mobile/vertical layout
                margin = { 
                    top: 40,          // Space for title/labels
                    right: 30, // Consistent right margin
                    bottom: 60,       // Space for x-axis labels
                    left: 75          // Space for y-axis labels
                };
                
                // For vertical screens, make the chart taller
                var verticalAspectRatio = 1.4; // Taller than wide
                var svgHeight = Math.min(containerHeight, svgWidth * verticalAspectRatio);
                
                // Ensure minimum height for mobile
                svgHeight = Math.max(svgHeight, 500);
            } else {
                // Desktop/horizontal layout
                margin = { 
                    top: 40,          // Space for title/labels
                    right: 30, // Consistent right margin
                    bottom: 60,       // Space for x-axis labels
                    left: 79         // Space for y-axis labels
                };
                
                // For horizontal screens, use a fixed aspect ratio
                var horizontalAspectRatio = 0.7; // Width:height ratio
                var svgHeight = svgWidth * horizontalAspectRatio;
            }
            
            // Update dimensions
            width = svgWidth - margin.left - margin.right;
            height = svgHeight - margin.top - margin.bottom;
            
            // Update SVG dimensions
            d3.select("#scatter-plot")
                .attr("width", svgWidth)
                .attr("height", svgHeight);
                
            // Update the chart container to match SVG size
            document.querySelector('.chart-container').style.height = svgHeight + 'px';
        }
        
        window.addEventListener('resize', function() {
            // Update dimensions immediately
            updateChartDimensions();
            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(function() {
                updateChart(); // Redraw the chart with new dimensions
            });
        });

        // Initial call to set dimensions
        updateChartDimensions();
        
        // Debounce function to limit how often the resize handler fires
        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        }
        
        // Track previous window dimensions to detect orientation changes
        var prevWindowWidth = window.innerWidth;
        var prevWindowHeight = window.innerHeight;
        
        // Add debounced resize handler
        window.addEventListener('resize', debounce(function() {
            // Check if orientation has changed (width/height ratio flipped)
            var wasVertical = prevWindowWidth / prevWindowHeight < 1;
            var isVertical = window.innerWidth / window.innerHeight < 1;
            
            // Update previous dimensions
            prevWindowWidth = window.innerWidth;
            prevWindowHeight = window.innerHeight;
            
              // Always update the chart on resize - use requestAnimationFrame for smoother updates
              requestAnimationFrame(function() {
                updateChart();
            });
        }, 50)); // Use a much shorter wait time for more responsive feel
        

        var medianLinesVisible = false;
        
        var selectX = d3.select("#select-x");
        var selectY = d3.select("#select-y");
        
        var names = data.map(function(row) {
            return row[1];
        });
        
        // Populate the select dropdowns
        header.slice(3).forEach(function(metric) {
            selectX.append("option")
                .text(metric)
                .attr("value", metric);
            selectY.append("option")
                .text(metric)
                .attr("value", metric);
        });
        
        // Set default values for the selectors
        selectX.property("value", header[3]);
        selectY.property("value", header[4]);
        
        // Create the SVG container
        var svg = d3.select("#scatter-plot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var xMetric = header[3];
        var yMetric = header[4]; // Use a different default for Y axis
        
        var xScale = d3.scaleLinear()
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .range([height, 0]);
        
        var xAxis = d3.axisBottom(xScale).tickSize(0);
        var yAxis = d3.axisLeft(yScale).tickSize(0);
        
        // Add X axis
        var gXAxis = svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")");
        
        // Add Y axis
        var gYAxis = svg.append("g")
            .attr("class", "y-axis");
        
        // Add axis labels
        var xLabel = svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 35)
            .style("font-family", "Inter, sans-serif")
            .style("font-size", "14px");
        
        var yLabel = svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -53)
            .attr("x", 0)
            .style("font-family", "Inter, sans-serif")
            .style("font-size", "14px");
        
        // Create tooltip
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
        
        // Function to check if device is mobile
        function isMobileDevice() {
            return window.innerWidth <= 768;
        }

        // Function to position tooltip to prevent overflow
        function positionTooltip(event, tooltipElement) {
            const tooltipNode = tooltipElement.node();
            if (!tooltipNode) return { left: 0, top: 0 };
            
            const tooltipRect = tooltipNode.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Default position
            let left = event.pageX + 10;
            let top = event.pageY - 28;
            
            // Adjust if tooltip would overflow right edge
            if (left + tooltipRect.width > viewportWidth - 10) {
                left = event.pageX - tooltipRect.width - 10;
            }
            
            // Adjust if tooltip would overflow bottom edge
            if (top + tooltipRect.height > viewportHeight - 10) {
                top = event.pageY - tooltipRect.height - 10;
            }
            
            // Ensure tooltip doesn't go off the left or top edge
            left = Math.max(10, left);
            top = Math.max(10, top);
            
            return { left, top };
        }

        var clickedCircles = [];
        var filteredData = data;
        var filteredNames = names;
        var circles;
        
        // Function to update the chart
        function updateChart() {
            // Update chart dimensions based on current window size
            updateChartDimensions();
            
            // Update SVG dimensions without recreating it
            d3.select("#scatter-plot")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
                
            // Update axis positions based on new dimensions
            gXAxis.attr("transform", "translate(0," + height + ")");
            xLabel.attr("x", width)
                  .attr("y", height + 35);
            yLabel.attr("x", 0);
            
            // Check if dark mode is active
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            // Get the selected league
            var selectedLeague = document.getElementById("select-league").value;
            
            
            // Filter data based on selected league
            if (selectedLeague === "all") {
                filteredData = data;
            } else if (selectedLeague === "Top 5 Leagues") {
                filteredData = data.filter(function(d) {
                    return d[2] === "Premier League" || d[2] === "La Liga" || 
                           d[2] === "Bundesliga" || d[2] === "Serie A" || 
                           d[2] === "Ligue 1";
                });
            } else {
                filteredData = data.filter(function(d) {
                    return d[2] === selectedLeague;
                });
            }
            
            // Update filtered names
            filteredNames = filteredData.map(function(d) {
                return d[1];
            });
            
            // Get the selected metrics
            xMetric = selectX.property("value");
            yMetric = selectY.property("value");
            
          // Update scales with consistent 10% padding on each side
          xScale.range([0, width])
      .domain(function() {
          // Get the raw extent
          const extent = d3.extent(filteredData, function(d) { 
              return +d[header.indexOf(xMetric)]; 
          });
          
          // Apply nice() to get rounded values
          const niceScale = d3.scaleLinear().domain(extent).nice();
          const niceExtent = niceScale.domain();
          
          // Calculate the original range and the nice range
          const originalRange = extent[1] - extent[0];
          const niceRange = niceExtent[1] - niceExtent[0];
          
          // Check if nice() added more than 10% padding
          if ((niceRange / originalRange) > 1.2) { // 1.2 represents original + 20% (10% on each side)
              // If so, use manual 10% padding instead
              const padding = originalRange * 0.1;
              return [extent[0] - padding, extent[1] + padding];
          } else {
              // Otherwise use the nice rounded values
              return niceExtent;
          }
      }());


                  yScale.range([height, 0])
      .domain(function() {
          // Get the raw extent
          const extent = d3.extent(filteredData, function(d) { 
              return +d[header.indexOf(yMetric)]; 
          });
          
          // Apply nice() to get rounded values
          const niceScale = d3.scaleLinear().domain(extent).nice();
          const niceExtent = niceScale.domain();
          
          // Calculate the original range and the nice range
          const originalRange = extent[1] - extent[0];
          const niceRange = niceExtent[1] - niceExtent[0];
          
          // Check if nice() added more than 10% padding
          if ((niceRange / originalRange) > 1.2) { // 1.2 represents original + 20% (10% on each side)
              // If so, use manual 10% padding instead
              const padding = originalRange * 0.1;
              return [extent[0] - padding, extent[1] + padding];
          } else {
              // Otherwise use the nice rounded values
              return niceExtent;
          }
      }());
            
            // Update axes
            gXAxis.call(d3.axisBottom(xScale).tickSize(0));
            gYAxis.call(d3.axisLeft(yScale).tickSize(0));
            
            // Create metric key for translation
            const xMetricKey = "metrics." + xMetric.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
            const yMetricKey = "metrics." + yMetric.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
            
            // Set data-i18n attribute
            xLabel.attr("data-i18n", xMetricKey);
            yLabel.attr("data-i18n", yMetricKey);
            
            // Apply translations directly if available
            if (window.currentTranslations && window.currentTranslations.metrics) {
                const xTranslationKey = xMetric.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
                const yTranslationKey = yMetric.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
                
                const xTranslation = window.currentTranslations.metrics[xTranslationKey];
                const yTranslation = window.currentTranslations.metrics[yTranslationKey];
                
                xLabel.text(xTranslation || xMetric);
                yLabel.text(yTranslation || yMetric);
            } else {
                xLabel.text(xMetric);
                yLabel.text(yMetric);
            }

            // Remove existing circles and labels
            svg.selectAll("circle").remove();
            svg.selectAll(".team-label").remove();
            svg.selectAll(".xy-line").remove(); // Remove any existing diagonal reference line
            svg.selectAll(".xy-line-bg").remove(); // Remove line background
            svg.selectAll(".xy-line-label").remove(); // Remove line label
            svg.selectAll(".xy-line-label-bg").remove(); // Remove label background
            svg.selectAll(".performance-label").remove(); // Remove performance labels
            svg.selectAll("linearGradient#line-gradient").remove(); // Remove gradient definition
            svg.selectAll("marker#arrow-over, marker#arrow-under").remove(); // Remove arrow markers
            svg.selectAll(".xy-line-hover").remove(); // Remove hover detection element
            svg.selectAll(".median-line").remove(); // Always remove median lines before potentially redrawing them
            
            // Add diagonal reference line for xG vs Goals
            if ((xMetric === 'xG per 90' && yMetric === 'Goals per 90') || 
                (xMetric === 'Goals per 90' && yMetric === 'xG per 90')) {
                
                // Variable to track hover timer for the diagonal line
                var diagonalLineHoverTimer = null;
                
                // Calculate the intersection points for the x=y line
                var minX = d3.min(filteredData, function(d) { return d[header.indexOf(xMetric)]; });
                var maxX = d3.max(filteredData, function(d) { return d[header.indexOf(xMetric)]; });
                var minY = d3.min(filteredData, function(d) { return d[header.indexOf(yMetric)]; });
                var maxY = d3.max(filteredData, function(d) { return d[header.indexOf(yMetric)]; });
                
                // Get the smaller max between the x and y axes
                var maxVal = Math.min(maxX, maxY);
                
                // Get the larger min between the x and y axes
                var minVal = Math.max(minX, minY);
                
                // Now draw the line only within these bounds
                svg.append("line")
                    .attr("class", "xy-line")
                    .attr("x1", xScale(minVal))
                    .attr("y1", yScale(minVal))
                    .attr("x2", xScale(maxVal))
                    .attr("y2", yScale(maxVal))
                    .style("stroke", "#2ecc71") // Simple green color
                    .style("stroke-width", "2")
                    .style("stroke-dasharray", "5,3");
                
                // Add invisible wider line for better hover detection
                svg.append("line")
                    .attr("class", "xy-line-hover")
                    .attr("x1", xScale(minVal))
                    .attr("y1", yScale(minVal))
                    .attr("x2", xScale(maxVal))
                    .attr("y2", yScale(maxVal))
                    .style("stroke", "transparent")
                    .style("stroke-width", "15")
                    .style("cursor", "help")
                    .on("mouseover", function() {
                        // Clear any existing timer
                        if (diagonalLineHoverTimer) {
                            clearTimeout(diagonalLineHoverTimer);
                        }
                        
                        // Capture the event coordinates
                        var eventX = d3.event.pageX;
                        var eventY = d3.event.pageY;
                        
                        // Set a new timer with delay
                        diagonalLineHoverTimer = setTimeout(function() {
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", 0.9);
                            
                            // Use the global getTranslation function
                            var tooltipContent = "<strong>" + getTranslation("tooltip.xg-line-title", "G = xG Line") + "</strong><br/>";
                            
                            // Check which axis is which and provide the correct explanation
                            if (xMetric === 'xG per 90' && yMetric === 'Goals per 90') {
                                tooltipContent += "<span>" + getTranslation("tooltip.xg-line-above", "Teams above this line are scoring more goals than expected.") + "</span><br/>" +
                                    "<span>" + getTranslation("tooltip.xg-line-below", "Teams below this line are scoring fewer goals than expected.") + "</span>";
                            } else {
                                tooltipContent += "<span>" + getTranslation("tooltip.xg-line-right", "Teams right of this line are scoring more goals than expected.") + "</span><br/>" +
                                    "<span>" + getTranslation("tooltip.xg-line-left", "Teams left of this line are scoring fewer goals than expected.") + "</span>";
                            }
                            
                            tooltip.html(tooltipContent)
                                .style("left", (eventX + 10) + "px")
                                .style("top", (eventY - 28) + "px");
                        }, 600); // 550ms delay before showing tooltip
                    })
                    .on("mouseout", function() {
                        // Clear the timer if mouse leaves before tooltip is shown
                        if (diagonalLineHoverTimer) {
                            clearTimeout(diagonalLineHoverTimer);
                            diagonalLineHoverTimer = null;
                        }
                        
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }
            
            // Add median lines if enabled
            if (medianLinesVisible) {
                // Calculate medians
                var xMedian = d3.median(filteredData, function(d) { 
                    return d[header.indexOf(xMetric)]; 
                });
                
                var yMedian = d3.median(filteredData, function(d) { 
                    return d[header.indexOf(yMetric)]; 
                });
                
                // Add X median line
                svg.append("line")
                    .attr("class", "median-line")
                    .attr("x1", xScale(xMedian))
                    .attr("y1", 0)
                    .attr("x2", xScale(xMedian))
                    .attr("y2", height)
                    .style("stroke", "rgba(0, 0, 0, 0.3)")
                    .style("stroke-dasharray", "4");
                
                // Add Y median line
                svg.append("line")
                    .attr("class", "median-line")
                    .attr("x1", 0)
                    .attr("y1", yScale(yMedian))
                    .attr("x2", width)
                    .attr("y2", yScale(yMedian))
                    .style("stroke", "rgba(0, 0, 0, 0.3)")
                    .style("stroke-dasharray", "4");
            }
            
            // Add circles
            circles = svg.selectAll("circle")
                .data(filteredData)
                .enter()
                .append("circle")
                .attr("cx", function(d) { return xScale(d[header.indexOf(xMetric)]); })
                .attr("cy", function(d) { return yScale(d[header.indexOf(yMetric)]); })
                .attr("r", 8)
                .style("fill", function(d) {
                    // Check if this circle is in the clicked circles array
                    if (clickedCircles.includes(d[1])) {
                        return getLeagueColor(d[2]);
                    }
                    return "rgba(70, 130, 180, 0.7)";
                })
                .style("stroke", function(d) {
                    return clickedCircles.includes(d[1]) ? "#000" : "none";
                })
                .style("stroke-width", function(d) {
                    return clickedCircles.includes(d[1]) ? 2 : 0;
                })
                .style("cursor", "pointer")
                .on("mouseover", function(d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", 10)
                        .style("fill", getLeagueColor(d[2])); // Show league color on hover
                    
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                    
                    // Create metric keys for translation
                    const xMetricKey = "metrics." + xMetric.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
                    const yMetricKey = "metrics." + yMetric.toLowerCase().replace(/ /g, '-').replace(/%/g, 'pct');
                    
                    // Get translated metric names using the global getTranslation function
                    const xMetricTranslated = getTranslation(xMetricKey, xMetric);
                    const yMetricTranslated = getTranslation(yMetricKey, yMetric);
                    
                    tooltip.html("<strong>" + d[1] + "</strong><br/>" +
                        xMetricTranslated + ": " + d[header.indexOf(xMetric)].toFixed(2) + "<br/>" +
                        yMetricTranslated + ": " + d[header.indexOf(yMetric)].toFixed(2));

                    // Position tooltip to prevent overflow
                    const tooltipNode = tooltip.node();
                    if (tooltipNode) {
                        const tooltipRect = tooltipNode.getBoundingClientRect();
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;
                        
                        // Default position
                        let left = d3.event.pageX + 10;
                        let top = d3.event.pageY - 28;
                        
                        // Adjust if tooltip would overflow right edge
                        if (left + tooltipRect.width > viewportWidth - 10) {
                            left = d3.event.pageX - tooltipRect.width - 10;
                        }
                        
                        // Adjust if tooltip would overflow bottom edge
                        if (top + tooltipRect.height > viewportHeight - 10) {
                            top = d3.event.pageY - tooltipRect.height - 10;
                        }
                        
                        // Ensure tooltip doesn't go off the left or top edge
                        left = Math.max(10, left);
                        top = Math.max(10, top);
                        
                        tooltip.style("left", left + "px")
                               .style("top", top + "px");
                    } else {
                        tooltip.style("left", (d3.event.pageX + 10) + "px")
                               .style("top", (d3.event.pageY - 28) + "px");
                    }
                    
                    // On mobile, hide tooltip after 1 second
                    if (window.innerWidth <= 768) {
                        setTimeout(function() {
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", 0);
                        }, 1000);
                    }
                })
                .on("mouseout", function(d) {
                    // Only hide tooltip on non-mobile devices (mobile has timeout)
                    if (window.innerWidth > 768) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    }
                    
                    // Get the original fill color
                    var isClicked = clickedCircles.includes(d[1]);
                    
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", 8)
                        .style("fill", function() {
                            // If the circle is clicked, keep the league color
                            // Otherwise, revert to the default blue
                            return isClicked ? getLeagueColor(d[2]) : "rgba(70, 130, 180, 0.7)";
                        });
                })
                .on("click", function(d) {
                    // Check if this is a search match
                    var isSearchMatch = d3.select(this).classed("search-match");
                    
                    // If it's a search match, clear the search first
                    if (isSearchMatch) {
                        resetSearch();
                    }
                    
                    // Toggle clicked state
                    var index = clickedCircles.indexOf(d[1]);
                    
                    if (index === -1) {
                        // Add to clicked circles
                        clickedCircles.push(d[1]);
                        d3.select(this)
                            .style("fill", getLeagueColor(d[2]))
                            .style("stroke", "#000")
                            .style("stroke-width", 2);
                            
                        // Add team label
                        addTeamLabel(d);
                    } else {
                        // Remove from clicked circles
                        clickedCircles.splice(index, 1);
                        d3.select(this)
                            .style("fill", "rgba(70, 130, 180, 0.7)")
                            .style("stroke", "none");
                            
                        // Remove team label
                        svg.selectAll(".team-label-" + d[1].replace(/\s+/g, '-').toLowerCase()).remove();
                    }
                    
                    // Update button text based on whether all circles are selected
                    updateSelectAllButtonText();
                    
                    // Update the legend
                    var selectedLeague = document.getElementById("select-league").value;
                    updateLeagueLegend(selectedLeague);
                });
                
            // Add labels for clicked teams
            clickedCircles.forEach(function(teamName) {
                var teamData = filteredData.find(function(d) {
                    return d[1] === teamName;
                });
                
                if (teamData) {
                    addTeamLabel(teamData);
                }
            });
                
            // Update button text based on current selection state
            updateSelectAllButtonText();
            
            // Update the legend to show only relevant leagues
            updateLeagueLegend(selectedLeague);
        }
        
        // Function to update the "Click All" button icon
        function updateSelectAllButtonText() {
            var selectIcon = document.getElementById('select-icon');
            var selectTooltip = document.getElementById('select-all-tooltip');
            var allSelected = filteredData.every(function(d) {
                return clickedCircles.includes(d[1]);
            });
            
            if (allSelected) {
                selectIcon.className = "ion-ios-circle-outline"; // Icon for "Unclick All"
                if (selectTooltip) {
                    // Use translations for unselect all teams
                    if (window.currentTranslations && window.currentTranslations.tooltip) {
                        selectTooltip.textContent = window.currentTranslations.tooltip.unselectAll || "Unselect all teams";
                    } else {
                        selectTooltip.textContent = "Unselect all teams";
                    }
                }
            } else {
                selectIcon.className = "ion-ios-circle-filled"; // Icon for "Click All"
                if (selectTooltip) {
                    // Use translations for select all teams
                    if (window.currentTranslations && window.currentTranslations.tooltip) {
                        selectTooltip.textContent = window.currentTranslations.tooltip.selectAll || "Select all teams";
                    } else {
                        selectTooltip.textContent = "Select all teams";
                    }
                }
            }
        }
        
        // Add event listeners to the selectors
        selectX.on("change", updateChart);
        selectY.on("change", updateChart);
        
        // Function to remove special characters and diacritics for better search matching
        function removeSpecialCharsAndDiacritics(str) {
            if (!str) return '';
            return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .replace(/Ø/g, 'O')
                .replace(/ø/g, 'o');
        }
        
        // Add search functionality
        var searchBar = document.getElementById("search-bar");
        
        searchBar.addEventListener("input", function() {
            var searchTerm = searchBar.value.toLowerCase();
            
            if (searchTerm === '') {
                resetSearch();
                return;
            }
            
            // Normalize search term to handle special characters and diacritics
            var normalizedSearchTerm = removeSpecialCharsAndDiacritics(searchTerm);
            
            // Reset previous search styling
            svg.selectAll("circle").classed("search-match", false)
                .style("fill", function(d) {
                    // Restore original fill color
                    return clickedCircles.includes(d[1]) ? getLeagueColor(d[2]) : "rgba(70, 130, 180, 0.7)";
                })
                .style("stroke", function(d) {
                    return clickedCircles.includes(d[1]) ? "#000" : "none";
                })
                .style("stroke-width", function(d) {
                    return clickedCircles.includes(d[1]) ? 2 : 0;
                })
                .style("filter", "none")
                .each(function() {
                    // Reset any inline styles that might interfere with our animation
                    d3.select(this).style("r", null);
                });
            
            svg.selectAll(".team-label")
                .classed("search-match", false)
                .classed("search-dimmed", false);
            
            // Find matching teams
            var matchingTeams = [];
            
            // Apply new search styling
            svg.selectAll("circle").filter(function(d) {
                var teamName = d[1].toLowerCase();
                var normalizedTeamName = removeSpecialCharsAndDiacritics(teamName);
                
                // Check both original and normalized versions for better matching
                var isMatch = teamName.includes(searchTerm) || normalizedTeamName.includes(normalizedSearchTerm);
                
                if (isMatch) {
                    matchingTeams.push(d[1]);
                }
                
                return isMatch;
            })
            .classed("search-match", true)
            .each(function() {
                // Bring matching circles to front
                this.parentNode.appendChild(this);
            });
            
            // If we have matches, dim non-matching labels
            if (matchingTeams.length > 0) {
                // First dim all labels
                svg.selectAll(".team-label").classed("search-dimmed", true);
                
                // Then highlight matching labels
                svg.selectAll(".team-label").filter(function() {
                    var labelText = d3.select(this).text();
                    return matchingTeams.includes(labelText);
                })
                .classed("search-match", true)
                .classed("search-dimmed", false)
                .each(function() {
                    // Bring matching labels to front
                    this.parentNode.appendChild(this);
                });
                
                // Add labels for matching teams that don't have labels yet
                matchingTeams.forEach(function(teamName) {
                    // Check if this team already has a label
                    var labelClass = "team-label-" + teamName.replace(/\s+/g, '-').toLowerCase();
                    if (svg.select("." + labelClass).size() === 0) {
                        // Find the team data
                        var teamData = filteredData.find(function(d) {
                            return d[1] === teamName;
                        });
                        
                        if (teamData) {
                            // Add the label
                            addTeamLabel(teamData);
                            // Apply search match styling
                            svg.select("." + labelClass).classed("search-match", true);
                        }
                    }
                });
            } else {
                // No matches found - reset to default state
                // Remove all team labels that aren't for clicked circles
                svg.selectAll(".team-label").each(function() {
                    var label = d3.select(this);
                    var teamName = label.text();
                    
                    if (!clickedCircles.includes(teamName)) {
                        label.remove();
                    }
                });
                
                // Make sure clicked circles remain highlighted
                svg.selectAll("circle")
                    .style("fill", function(d) {
                        return clickedCircles.includes(d[1]) ? getLeagueColor(d[2]) : "rgba(70, 130, 180, 0.7)";
                    })
                    .style("stroke", function(d) {
                        return clickedCircles.includes(d[1]) ? "#000" : "none";
                    })
                    .style("stroke-width", function(d) {
                        return clickedCircles.includes(d[1]) ? 2 : 0;
                    });
            }
        });
        
        function resetSearch() {
            // Clear the search input field
            searchBar.value = '';
            
            // Reset circle styling
            svg.selectAll("circle")
                .classed("search-match", false)
                .style("fill", function(d) {
                    return clickedCircles.includes(d[1]) ? getLeagueColor(d[2]) : "rgba(70, 130, 180, 0.7)";
                })
                .style("stroke", function(d) {
                    return clickedCircles.includes(d[1]) ? "#000" : "none";
                })
                .style("stroke-width", function(d) {
                    return clickedCircles.includes(d[1]) ? 2 : 0;
                })
                .style("filter", "none")
                .each(function() {
                    // Reset any inline styles that might interfere with our animation
                    d3.select(this).style("r", null);
                    // Stop any ongoing animations
                    d3.select(this).interrupt();
                });
                
            // Reset label styling
            svg.selectAll(".team-label")
                .classed("search-match", false)
                .classed("search-dimmed", false)
                .each(function() {
                    // Stop any ongoing animations
                    d3.select(this).interrupt();
                });
                
            // Remove labels for teams that aren't clicked
            svg.selectAll(".team-label").each(function() {
                var label = d3.select(this);
                var teamName = label.text();
                
                if (!clickedCircles.includes(teamName)) {
                    label.remove();
                }
            });
        }
        
        // Toggle median lines
        var toggleButton = document.getElementById("toggle-median-lines");
        toggleButton.addEventListener("click", function() {
            medianLinesVisible = !medianLinesVisible;
            updateChart();

            const medianTooltip = document.getElementById('median-lines-tooltip');
            // Use translations for the median lines tooltip
            if (window.currentTranslations && window.currentTranslations.tooltip) {
                medianTooltip.textContent = medianLinesVisible ? 
                    (window.currentTranslations.tooltip.hideMedianLines || "Hide median lines") : 
                    (window.currentTranslations.tooltip.showMedianLines || "Show median lines");
            } else {
                medianTooltip.textContent = medianLinesVisible ? "Hide median lines" : "Show median lines";
            }
        });
        
        // Select all circles
        function selectAllCircles() {
            // Check if all circles are already selected
            var allSelected = filteredData.every(function(d) {
                return clickedCircles.includes(d[1]);
            });
            
            if (allSelected) {
                // Deselect all circles
                clickedCircles = [];
                svg.selectAll("circle")
                    .style("fill", "rgba(70, 130, 180, 0.7)")
                    .style("stroke", "none");
                
                // Remove all team labels
                svg.selectAll(".team-label").remove();
            } else {
                // Select all circles
                svg.selectAll("circle").each(function(d) {
                    if (!clickedCircles.includes(d[1])) {
                        clickedCircles.push(d[1]);
                        d3.select(this)
                            .style("fill", getLeagueColor(d[2]))
                            .style("stroke", "#000")
                            .style("stroke-width", 2);
                    }
                });
                
                // Add labels for all teams
                filteredData.forEach(function(d) {
                    addTeamLabel(d);
                });
            }
            
            // Update button text
            updateSelectAllButtonText();
            
            // Update the legend
            var selectedLeague = document.getElementById("select-league").value;
            updateLeagueLegend(selectedLeague);
        }
        

        
        // Initialize the chart
        updateChart();
        
        // Initialize the custom selectors now that data is loaded
        initializeCustomSelectors();
        
        // Function to update the league legend based on selected league
        function updateLeagueLegend(selectedLeague) {
            var legendContainer = document.getElementById('league-legend');
            
            // If only one league is selected (and it's not "all" or "Top 5 Leagues"), hide the legend completely
            if (selectedLeague !== "all" && selectedLeague !== "Top 5 Leagues") {
                legendContainer.style.display = 'none';
                return;
            }
            
                  // Hide the legend if no teams are clicked
                  if (clickedCircles.length === 0) {
                legendContainer.style.display = 'none';
                return;
            }
            
            // Check if any of the currently visible teams are selected
            var anyVisibleTeamsSelected = false;
            for (var i = 0; i < filteredData.length; i++) {
                if (clickedCircles.includes(filteredData[i][1])) {
                    anyVisibleTeamsSelected = true;
                    break;
                }
            }
            
            // Hide the legend if none of the visible teams are selected
            if (!anyVisibleTeamsSelected) {
                legendContainer.style.display = 'none';
                return;
            }
            
            // Otherwise, show the legend
            legendContainer.style.display = 'flex';
            legendContainer.innerHTML = ''; // Clear existing legend
            

            // Add a title for the legend
            var legendTitle = document.createElement('div');
            legendTitle.style.fontWeight = 'bold';
            legendTitle.style.marginRight = '15px';
            legendContainer.appendChild(legendTitle);
            
            // Determine which leagues to show in the legend
            var leaguesToShow = [];
            
            if (selectedLeague === "all") {
                // Show all leagues
                leaguesToShow = Object.keys(leagueColors);
            } else if (selectedLeague === "Top 5 Leagues") {
                // Show only Top 5 leagues
                leaguesToShow = ["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"];
            }
            
            // Add an item for each relevant league
            leaguesToShow.forEach(function(league) {
                var legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                
                var colorBox = document.createElement('div');
                colorBox.className = 'legend-color';
                colorBox.style.backgroundColor = leagueColors[league];
                
                var leagueText = document.createElement('span');
                leagueText.textContent = league;
                
                legendItem.appendChild(colorBox);
                legendItem.appendChild(leagueText);
                legendContainer.appendChild(legendItem);
            });
        }
        

        function addTeamLabel(d, isSearchMatch) {
    var x = xScale(d[header.indexOf(xMetric)]);
    var y = yScale(d[header.indexOf(yMetric)]);
    
    // Create a unique class name for this team's label
    var teamClass = "team-label-" + d[1].toLowerCase()
    .replace(/\s+/g, '-');
    
    // Check if this label already exists (avoid duplicates)
    if (svg.select("." + teamClass).size() > 0) {
        return;
    }
    
    // Create the label temporarily to measure its width
    var tempLabel = svg.append("text")
        .attr("class", "temp-label")
        .text(d[1])
        .style("font-family", "Inter, sans-serif")
        .style("font-size", "12px")
        .style("opacity", 0);
    
    var labelWidth = tempLabel.node().getComputedTextLength();
    tempLabel.remove();
    
    // Define 4 possible positions (right, left, top, bottom) - closer to the dot
    var positions = [
        { dx: 8, dy: 0, anchor: "start" },      // Right (closest)
        { dx: -8, dy: 0, anchor: "end" },       // Left (closest)
        { dx: 0, dy: -8, anchor: "middle" },    // Top (closest)
        { dx: 0, dy: 8, anchor: "middle" }      // Bottom (closest)
    ];
    
    // Get all existing labels' bounding boxes for quick collision detection
    var existingLabelBoxes = [];
    svg.selectAll("text.team-label").each(function() {
        var bbox = this.getBBox();
        existingLabelBoxes.push({
            x1: bbox.x - 2,
            y1: bbox.y - 2,
            x2: bbox.x + bbox.width + 2,
            y2: bbox.y + bbox.height + 2
        });
    });
    
    // Find the first non-colliding position
    var chosenPosition = null;
    var labelHeight = 12; // Approximate height based on font size
    
    // Get chart boundaries
    var chartWidth = width;
    var chartHeight = height;
    
    // If it's a search match, we'll always show the label regardless of collisions
    if (!isSearchMatch) {
        for (var i = 0; i < positions.length; i++) {
            var pos = positions[i];
            var labelX = x + pos.dx;
            var labelY = y + pos.dy;
            
            // Calculate label bounds based on anchor
            var labelBox = {
                x1: pos.anchor === "end" ? labelX - labelWidth : (pos.anchor === "middle" ? labelX - labelWidth/2 : labelX),
                y1: pos.dy < 0 ? labelY - labelHeight : labelY,
                x2: pos.anchor === "start" ? labelX + labelWidth : (pos.anchor === "middle" ? labelX + labelWidth/2 : labelX),
                y2: pos.dy < 0 ? labelY : labelY + labelHeight
            };
            
            // Check if label is within chart boundaries
            if (labelBox.x1 < 0 || labelBox.x2 > chartWidth || 
                labelBox.y1 < 0 || labelBox.y2 > chartHeight) {
                continue; // Skip this position if label would be outside chart
            }
            
            // Check for collisions
            var hasCollision = false;
            for (var j = 0; j < existingLabelBoxes.length; j++) {
                var existing = existingLabelBoxes[j];
                if (!(labelBox.x2 < existing.x1 || labelBox.x1 > existing.x2 || 
                      labelBox.y2 < existing.y1 || labelBox.y1 > existing.y2)) {
                    hasCollision = true;
                    break;
                }
            }
            
            if (!hasCollision) {
                chosenPosition = pos;
                break;
            }
        }
        
        // If all positions have collisions, check if there are too many neighbors
        // If so, skip this label entirely
        if (!chosenPosition) {
            // Count nearby labels (within a certain radius)
            var radius = 50; // Adjust based on chart density
            var neighborCount = 0;
            
            existingLabelBoxes.forEach(function(box) {
                var centerX = (box.x1 + box.x2) / 2;
                var centerY = (box.y1 + box.y2) / 2;
                var distance = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));
                
                if (distance < radius) {
                    neighborCount++;
                }
            });
            
            // If too crowded, skip this label
            if (neighborCount > 3) {
                return;
            }
        }
    }
    
    // Use the default right position if no non-colliding position was found or if it's a search match
    if (!chosenPosition) {
        chosenPosition = positions[0];
        
        // For edge cases, adjust the position to keep label within bounds
        var labelX = x + chosenPosition.dx;
        var labelY = y + chosenPosition.dy;
        
        var labelBox = {
            x1: chosenPosition.anchor === "end" ? labelX - labelWidth : (chosenPosition.anchor === "middle" ? labelX - labelWidth/2 : labelX),
            y1: chosenPosition.dy < 0 ? labelY - labelHeight : labelY,
            x2: chosenPosition.anchor === "start" ? labelX + labelWidth : (chosenPosition.anchor === "middle" ? labelX + labelWidth/2 : labelX),
            y2: chosenPosition.dy < 0 ? labelY : labelY + labelHeight
        };
        
        // Adjust position if needed to keep within bounds
        if (labelBox.x1 < 0) {
            chosenPosition = positions[0]; // Use right position
        } else if (labelBox.x2 > chartWidth) {
            chosenPosition = positions[1]; // Use left position
        }
        
        if (labelBox.y1 < 0) {
            chosenPosition = positions[3]; // Use bottom position
        } else if (labelBox.y2 > chartHeight) {
            chosenPosition = positions[2]; // Use top position
        }
    }
    
    // Create the actual label with the chosen position
    var label = svg.append("text")
        .attr("class", "team-label " + teamClass)
        .attr("x", x + chosenPosition.dx)
        .attr("y", y + chosenPosition.dy)
        .attr("text-anchor", chosenPosition.anchor)
        .attr("dominant-baseline", chosenPosition.dy < 0 ? "auto" : "hanging")
        .text(d[1])
        .style("font-family", "Inter, sans-serif")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("fill", "#333");
    
    // If it's a search match, add the search-match class
    if (isSearchMatch) {
        label.classed("search-match", true);
    }
        
    // Add this label's bounding box to the collection for future labels
    var bbox = label.node().getBBox();
    existingLabelBoxes.push({
        x1: bbox.x - 2,
        y1: bbox.y - 2,
        x2: bbox.x + bbox.width + 2,
        y2: bbox.y + bbox.height + 2
    });
}

        // Initialize median lines tooltip text on page load
        document.addEventListener('DOMContentLoaded', function() {
            const medianTooltip = document.getElementById('median-lines-tooltip');
            medianTooltip.textContent = medianLinesVisible ? "Hide median lines" : "Show median lines";
        });