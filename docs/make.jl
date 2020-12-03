using Freenect
using Documenter

makedocs(;
    modules=[Freenect],
    authors="dmillard <dmillard10@gmail.com> and contributors",
    repo="https://github.com/dmillard/Freenect.jl/blob/{commit}{path}#L{line}",
    sitename="Freenect.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://dmillard.github.io/Freenect.jl",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
        "installation.md",
        "getting_started.md",
        "displaying_images.md",
        "reference.md"
    ],
)

deploydocs(;
    repo="github.com/dmillard/Freenect.jl",
    devbranch="main",
)
