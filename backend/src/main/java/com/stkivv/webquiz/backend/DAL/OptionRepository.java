package com.stkivv.webquiz.backend.DAL;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stkivv.webquiz.backend.domain.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, UUID> {

}

