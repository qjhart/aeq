construct { ?s ?p ?o }
WHERE {
  {
    select distinct ?s where {
      ?uri a ?type.
      ?s a ?t.
      filter(regex(str(?s),concat("^",str(?uri),"(#|$)")))
    } order by ?s limit $limit
  }
  ?s ?p ?o.
}
