    // useEffect(() => {
    //     // fetch('http://111.229.183.248/assets/avatar-CLbFvChd.png')
    //     fetch('http://111.229.183.248/assets/avatar-CLbFvChd.png')
    //         .then((response: any) => {
    //             const total = parseInt(response.headers.get('Content-Length'), 10);
    //             let loaded = 0;
    //             const reader = response.body.getReader();
    //             return reader.read().then(function process(result: any) {
    //                 if (result.done) {
    //                     setLoading(false);
    //                     return;
    //                 }
    //                 loaded += result.value.length;
    //                 const progress = (loaded / total) * 100;
    //                 console.log(`Loaded ${progress}%`);
    //                 return reader.read().then(process);
    //             });
    //         })
    //         .catch(error => console.error(error));
    // }, [])
