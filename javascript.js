const margin = {top:30, left:50, bottom:40, right:20};
const width = 750 - margin.left - margin.right; 
const height = 600 - margin.top - margin.bottom; 
const svg = d3.select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate('+margin.left+','+margin.top+')')

const xScale = d3.scaleBand()
    //.domain(data.map(d=>d.company))
    .rangeRound([0, width])
    .paddingInner(0.1)

const yScale = d3.scaleLinear()
    //.domain(d3.extent(data,d=>d.stores))
    .rangeRound([height,0])


svg.append('g')
    //.call(xAxis)
    .attr('class', 'x-axis')
    .attr("transform", `translate(0, ${height})`)


svg.append('g')
    .attr('class', 'y-axis')
    //.call(yAxis)

svg.append('text')
    .attr('x',width-55)
    .attr('y',height+30)
    //.text('Company')
    .attr('class', 'x-axis-title');

svg.append('text')
    .attr('x',-30)
    .attr('y',-25)
    .attr('class', 'y-axis-title')
    //.text('Stores')
    .attr("transform", "rotate(-90)");


let type = document.querySelector('#group-by');
let direction=true;

let select = document.querySelector('#group-by');
let sort = document.querySelector('#sort');
select.addEventListener('change',function(){
    type=this.value;
    loadData(type);
});

let count=0;
sort.addEventListener('click',function(){
    direction =!direction;
    count=1;
    loadData(type);
})


function update(data,type){
    
    //makes sure that the sort button is pressed at least one to sort the bars and alternate
    if (count=1 && type=='revenue'){
        if (direction==true){
            coffee.sort(function(a,b){
                return a.revenue-b.revenue;
            });    
        }
        else {
            coffee.sort(function(a,b){
                return b.revenue-a.revenue;
            });
        }
    }

    if (count=1 && type=='stores'){
        if (direction==true){
            coffee.sort(function(a,b){
                return a.stores-b.stores;
            });    
        }
        else {
            coffee.sort(function(a,b){
                return b.stores-a.stores;
            });
        }
    }

    xScale.domain(coffee.map(d=>d.company))
    yScale.domain([0,d3.max(data,d=>d[type])])


    const bar = svg.selectAll('.bars')
        .data(coffee);

    bar.enter()
        .append('rect')
        .attr('class','bars')
        .attr("opacity", 0)
        .merge(bar)
        .transition()
        .delay(200)
        .duration(1000)
        .attr('width', xScale.bandwidth())
        .attr('height', function(d){
            return height-yScale(d[type]);
        })
        .attr('x',d=>xScale(d.company))
        .attr('y',d=> yScale(d[type]))
        .attr('fill','#865F3A')
        .attr("opacity", 1.0);

        bar.exit().remove();

    

    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);
    
    svg.select('.x-axis')
        .call(xAxis);
    
    svg.select('.y-axis')
        .call(yAxis);
    
    svg.select('.x-axis-title')
        .text('Company');

    svg.select('.y-axis-title')
        .text(function(d){
            return type;
        });

}
let coffee;
function loadData(type){
d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    coffee=data;
    //console.log(coffee); 
    update(coffee,type);    
    
});
}

