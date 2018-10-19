module.exports = (req, res) => {


	let limit = req.query.limit << 0;
	if (limit === 0) limit = 5;
	let page = req.query.page << 0;
	if (page === 0) page = 1;


	let sortBy = 'updateAt';

	if (typeof req.query.sortBy === 'string' && req.query.sortBy.trim() !== '')
		sortBy = req.query.sortBy;
	if (typeof req.query.dir === 'string' && req.query.dir.trim() !== '') {
		sortBy = (req.query.dir === 'asc') ? sortBy : '-' + sortBy;
	} else {
		sortBy = '-updateAt';
	}


	let queryObj = {};
	if (typeof req.query.condition === 'string') {
		try {
			queryObj = JSON.parse(req.query.condition);
		} catch (error) {
			queryObj = {};
		}
	}

	req.MODEL_BIM
		.find(queryObj)
		// .skip((page - 1) * limit)
		// .limit(limit)
		.sort(sortBy)
		.populate({
			path: 'lodLevels',
			select: 'fileName name value',
		})
		.exec(function (err, listBIM) {
			if (err)
				return res.status(403).send(err);
			let resultData = [];
			listBIM.forEach(dataBIM => {
				let dataTemp = dataBIM['_doc'];
				let geometry = '';
			
				if(dataBIM['lodLevels'][0] !== undefined) {
					geometry = dataBIM['lodLevels'][0].fileName;
				}
				dataTemp['lodLevelShow'] = [];
				if(Array.isArray(dataBIM['lodLevels'])) {
					dataBIM['lodLevels'].forEach(dataLOD => {
						dataTemp['lodLevelShow'].push( dataLOD.name + '(' + dataLOD.value + ')' );
					})
				}
				dataTemp['subCategoryTerm'] = dataBIM['parameters']['sucategory_id']['term'];
				dataTemp['unitShow'] = dataBIM['parameters']['unit'];
				dataTemp['geometry'] = geometry;
				resultData.push(dataTemp);
				
			});
			return res.status(200).json({ data: resultData });
		});
}