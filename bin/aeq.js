#! /usr/bin/env node
'use strict';

import fs from 'fs';
import { EventEmitter, once } from 'node:events';

import cli_args from 'command-line-args';
import cli_usage from 'command-line-usage';

import { newEngine } from '@comunica/actor-init-sparql';
const sparql = newEngine();

import { DataFactory } from 'rdf-data-factory';
const df = new DataFactory();

import { LoggerPretty } from '@comunica/logger-pretty';
const logger = new LoggerPretty({ name: 'sparql' });

import { Bindings } from '@comunica/bus-query-operation';

//Store examples
import { Quadstore } from 'quadstore';
import { MemoryLevel } from 'memory-level';
const backend = new MemoryLevel();
const store = new Quadstore({ backend,
                              dataFactory: df });

//JSONLD utilities
import md5 from 'md5';
import jsonld from 'jsonld';

import { JsonLdParser } from "jsonld-streaming-parser";
const parser = new JsonLdParser();

function set_bindings(cli_binds) {
  let binds={}
  cli_binds.forEach(function(x) {
    let [key, val]=x.split('=')
//    binds[key]=df.literal(val)
    binds[key]=df.namedNode(val)
  });

  return new Bindings(binds);
}

const options = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  },
  {
    name: 'bind',
    lazyMultiple:true,
    description: 'Variables to bind'
  },
  {
    name: 'query',
//    defaultOption:false,
    description: 'Sparql query'
  },
  {
    name: 'files',
    defaultOption:true,
    multiple:true,
    description: 'Data Files'
  },
  {
    name: 'query@',
//    defaultOption:false,
    description: 'Sparql query file'
  }
];

const cli = cli_args(options);

const usage = cli_usage(
  [
    {
      header: 'AEQ',
      content: 'Aggie Experts Query'
    },
    {
      header: 'Options',
      optionList: options
    }
  ]
);

if (cli.help) {
  console.log(usage);
  process.exit(0);
}

async function readFilesSync(cli,parser,store) {
  for (let i=0; i<cli.files.length; i++) {
    let fn=cli.files[i];
    console.log("Reading file: "+fn);
    let stream=store.import(parser.import(fs.createReadStream(fn)));
    await once(stream, 'end');
//    console.log(`${fn} size:`,store.size);
  }
}

function readFiles(cli,parser,store) {
  return Promise.all(cli.files.map((fn) => {
    console.log("Reading file: "+fn);
    let stream=store.import(parser.import(fs.createReadStream(fn)));
    return once(stream, 'end');
  }))
}

await store.open();

if (cli.files.length>0) {
  await readFiles(cli,parser,store);
}
//console.log("Store size: "+store.size);
store.match().forEach(function(x) {console.log(x)});


function query_example() {

  if( !cli.query ) {
  if(cli['query@']) {
    cli.query=fs.readFileSync(cli['query@'],{encoding:'utf8',flag:'r'})
    console.log(cli.query)
  } else {
    console.error('No query Specified')
    process.exit(1);
  }
}

  const query=`
PREFIX experts: <http://experts.ucdavis.edu/>
PREFIX grant: <http://experts.ucdavis.edu/grant/>
PREFIX vivo: <http://vivoweb.org/ontology/core#>

select ?grant WHERE {
  ?grant a vivo:Grant;
} LIMIT 10
`;


  let bindings=set_bindings(cli.bind || []);

  do_query(cli.query,bindings);

  async function do_query(query,bindings) {
    const result = await sparql.query(
      query,
      {
        sources:["http://localhost:8081/experts/sparql"],
        initialBindings:bindings
      }
    );

    async function example_select_result(result) {
      result.bindingsStream.on('data', (d) => {
        console.log(d.get('?grant').value);
      });

      result.bindingsStream.on('error', (error) => {
        console.error(`ERROR ${error}`);
      });

      result.bindingsStream.on('end', () => {
      });
    }

  //example_select_result(result)

    //  const { data } = await sparql.resultToString(result,'application/sparql-results+json');
    const { data } = await sparql.resultToString(result,'application/ld+json');
    const context={"@context":{
    experts: "http://experts.ucdavis.edu/",
      grant: "http://experts.ucdavis.edu/grant/",
      vivo: "http://vivoweb.org/ontology/core#"
    }};

    var file=''
    // Maybe, I could just add the quads, but I don't see it in the jsonld package
    data.on('data',(d)=>{file+=d;});
    data.on('end',async function() {

      const doc=JSON.parse(file);
      const  framed  = await jsonld.frame(doc,context)
      console.log(JSON.stringify(framed));
      const canonized = await jsonld.canonize(doc,{
        algorithm: 'URDNA2015',
        format: 'application/n-quads'
      })
      //    console.log(md5(canonized));
    });
  }
}
