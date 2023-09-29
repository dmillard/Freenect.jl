macro exported_enum(name, values)
    export_sym(ex::Expr) = Expr(:export, ex.args[1])
    export_sym(ex::Symbol) = Expr(:export, ex)
    export_sym(ex::LineNumberNode) = ex
    esc(quote
        @enum($name, $values)
        export $name
        $(export_sym.(values.args)...)
    end)
end

macro exported_cfun(proto)
    hasdocs = proto.head == :block
    if hasdocs
        docs = proto.args[2]
        proto = pop!(proto.args[2].args)
    end

    nameargs, returntype = proto.args
    name = nameargs.args[1]
    args = nameargs.args[2:end]
    argname(ex::Expr)::Symbol = ex.args[1]
    argtype(ex::Expr)::Union{Symbol,Expr} = ex.args[2]
    defn = quote
        function $name($(argname.(args)...))
            ccall(
                ($(QuoteNode(Symbol("freenect_", name))), libfreenect_jll.libfreenect_sync),
                $returntype,
                ($(argtype.(args)...),),
                $(argname.(args)...)
            )
        end
    end

    if hasdocs
        push!(docs.args, defn.args[2])
        defn = docs
    end

    return esc(quote
        $defn
        export $name
    end)
end
