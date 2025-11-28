export default function StatsCards(){

    return(
        <div>
            <section className="website-summary mb-4">
                <div className="row">
                    <div className="col-md-4">
                        <div
                        className="card p-4 text-center"
                        style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #ddd',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                        }}
                        >
                        <i className="fas fa-box fa-3x mb-3" style={{ color: '#5a5a5a' }}></i>
                        <h5>Total Pages</h5>
                        <p className="h4">50</p>
                        </div>
                    </div>
                <div className="col-md-4">
                    <div
                    className="card p-4 text-center"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                    }}
                    >
                    <i className="fas fa-images fa-3x mb-3" style={{ color: '#5a5a5a' }}></i>
                    <h5>Total Banner Albums</h5>
                    <p className="h4">23</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                    className="card p-4 text-center"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                    }}
                    >
                    <i className="fas fa-newspaper fa-3x mb-3" style={{ color: '#5a5a5a' }}></i>
                    <h5>Total News</h5>
                    <p className="h4">6</p>
                    </div>
                </div>
                </div>
            </section>
        </div>
    )
}